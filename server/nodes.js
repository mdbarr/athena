'use strict';

const EventEmitter = require('events');

function Nodes (athena) {
  const self = this;

  //////////

  const aggregate = function(items) {
    const healths = Object.keys(athena.constants.health).reverse();
    for (const health of healths) {
      if (items.includes(health)) {
        return health;
      }
    }
    return athena.constants.health.healthy;
  };

  //////////

  class DataSet {
    constructor (size = 1000) {
      this.type = 'gauge';
      this.size = size;

      // Ring buffer
      this.data = new Array(size);
      this.first = 0;
      this.length = 0;
    }

    push ({
      type = 'gauge', value, timestamp
    }) {
      const point = {
        type,
        value,
        timestamp: timestamp || athena.util.timestamp
      };

      this.type = type;

      if (this.length === this.size) {
        this.data[this.first] = point;
        this.first = (this.first + 1) % this.size;
      } else {
        this.data[(this.first + this.length) % this.size] = value;
        this.length++;
      }

      return point;
    }
  }

  //////////

  const nodes = {};

  class Node extends EventEmitter {
    constructor ({
      id,
      name,
      parent = 'root',
      children = [],
      icon = 'network-outline',
      triggers = [],
      delegate = null,
      metadata = {},
      ephemeral = false,
      behavior
    } = {}) {
      super();

      const node = this;

      if (id && parent === id) {
        parent = null;
      }

      athena.util.addPrivate(node, '_athena', athena);

      node.config = {
        id: id || athena.util.id(),
        object: 'node',
        name: name || 'Unnamed',

        type: 'node',
        parent,
        children,
        icon,
        typeIcon: 'network-outline',
        triggers,
        delegate,
        metadata,
        ephemeral
      };

      node.config.behavior = behavior && typeof behavior === 'object' ?
        behavior : {};

      // status behavior: own, aggregate, children
      node.config.behavior.status = node.config.behavior.status || 'own';
      // trigger behavior: self, children, all
      node.config.behavior.trigger = node.config.behavior.trigger || 'self';
      // sync behavior: true, false
      node.config.behavior.sync = node.config.behavior.sync !== undefined ?
        node.config.behavior.sync : true;

      node.id = node.config.id;

      node.status = {
        enabled: false,
        active: false,
        uptime: 0,

        health: athena.constants.health.unknown,
        description: '',
        state: null,

        graph: new Array(50).fill(0),
        updatedAt: null,
        triggeredAt: null,
        children: []
      };

      node.dataset = new DataSet();

      athena.util.addPrivate(node, '_computed', {
        aggregate: true, // include this computation
        [Symbol.iterator] () {
          return {
            next () {
              if (this._index < this._keys.length) {
                return {
                  value: this._keys[this._index++],
                  done: false
                };
              }
              return { done: true };
            },
            _index: 0,
            _keys: Object.keys(node.status).concat(Object.keys(node._computed))
          };
        }
      });

      node.actions = {
        enable: {
          tooltip: 'Enable node',
          icon: 'play',
          call: node.enable.bind(node),
          available: () => { return !node.status.enabled; }
        },
        disable: {
          tooltip: 'Disable node',
          icon: 'stop',
          call: node.disable.bind(node),
          available: () => { return node.status.enabled; }
        },
        trigger: {
          tooltip: 'Trigger node',
          icon: 'update',
          call: node.trigger.bind(node),
          available: () => { return node.status.enabled; }
        }
      };

      node.computed = new Proxy({}, {
        enumerate () {
          return Object.keys(node.status).concat(Object.keys(node._computed));
        },
        ownKeys () {
          return Object.keys(node.status).concat(Object.keys(node._computed));
        },
        getOwnPropertyDescriptor (object, property) {
          let value;
          if (node._computed.hasOwnProperty(property)) {
            value = node.computed[property];
          } else if (node.status.hasOwnProperty(property)) {
            value = node.status[property];
          } else {
            return undefined;
          }

          return {
            value,
            writable: true,
            enumerable: true,
            configurable: true
          };
        },
        get (object, property) {
          if (property === 'health') {
            if (node.config.behavior.status === 'own' || !node.status.children.length) {
              return node.status.health;
            } else if (node.config.behavior.status === 'aggregate') {
              return aggregate([ node.status.health, ...node.status.children ]);
            } else if (node.config.behavior.status === 'children') {
              return aggregate(node.status.children);
            }
            return athena.constants.health.unknown;
          } else if (property === 'aggregate') {
            return aggregate(node.status.children);
          } else if (node._computed[property] &&
                     typeof node._computed[property] === 'function') {
            return node._computed[property](object, property);
          }
          return node.status[property];
        },
        set (object, property, value) {
          if (typeof value === 'function') {
            node._computed[property] = value;
          }
        }
      });

      node.on('config', () => {
        node.id = node.config.id;
        if (node.status.enabled && !node.config.ephemeral) {
          node.save();
        }
      });
    }

    enable () {
      if (!this.status.enabled) {
        this.status.enabled = true;
      }
    }

    disable () {
      if (this.status.enabled) {
        this.status.enabled = true;
      }
    }

    activate () {
      if (!this.status.active) {
        athena.triggers.activate(this);
        this.status.active = true;
      }
    }

    deactivate () {
      if (this.status.active) {
        athena.triggers.deactivate(this);
        this.status.active = false;
      }
    }

    reconfigure (config) {
      Object.merge(this.config, config);

      if (this.status.enabled) {
        this.emit('config', this.config);
        athena.events.emit('config', this, this.config);
      }
    }

    update ({
      health, state = null, description, metric
    }) {
      if (health !== undefined) {
        this.status.health = health;
        this.status.state = state;
      }
      if (description !== undefined) {
        this.status.description = description;
      }
      if (metric !== undefined) {
        this.status.graph.pop();
        this.status.graph.unshift(metric);
      }
      if (this.status.enabled) {
        this.status.updatedAt = Date.now();
        this.emit('status', this.status);
        athena.events.emit('status', this, this.status);
      }
    }

    save () {
      this.emit('save', this.serialize());
    }

    addChild (child) {
      const node = this;
      const childId = node.config.children.length;

      child.on('status', () => {
        if (child.status.enabled) {
          node.status.children[childId] = child.computed.health;
          node.emit('status', child, child.status);
          athena.events.emit('status', node, node.status);
        }
      });

      node.config.children.push(child.id);
    }

    link () {
      if (this.config.parent && !this._linked) {
        const parent = athena.store.resolve(this.config.parent);
        parent.addChild(this);
        athena.util.addPrivate(this, '_parent', parent);
        athena.events.emit('linked', this, parent);
        this._linked = true;
      }
    }

    path () {
      const path = [];
      let current = this;

      while (current) {
        path.unshift({
          id: current.config.id,
          name: current.config.name,
          type: current.config.type,
          icon: current.config.icon
        });

        current = current.config.parent ?
          athena.store.resolve(current.config.parent) :
          null;
      }

      for (let i = 0; i < path.length; i++) {
        path[i].depth = i;
      }

      return path;
    }

    describe () {
      return {
        name: 'String',
        parent: 'String',
        icon: 'String',
        triggers: 'Array',
        metadata: 'Object',
        sync: 'Boolean'
      };
    }

    render () {
      const object = {};
      for (const item in this.config) {
        if (item.startsWith('_') ||
            this.config.propertyIsEnumerable(item) === false ||
            item === 'domain') {
          continue;
        }
        object[item] = this.config[item];
      }

      object.status = {};
      for (const item in this.computed) {
        if (item.startsWith('_')) {
          continue;
        }
        object.status[item] = this.computed[item];
      }

      object.actions = [];
      for (const name of Object.keys(this.actions).sort()) {
        if (typeof this.actions[name].available === 'function' &&
            !this.actions[name].available()) {
          continue;
        }
        const action = {
          name,
          tooltip: this.actions[name].tooltip || '',
          icon: this.actions[name].icon || 'cursor-default-click-outline'
        };

        object.actions.push(action);
      }

      return object;
    }

    tree (depth = 0) {
      const render = this.render();
      render.depth = depth;
      render.children = this.config.children.
        map(child => { return athena.store.resolve(child); }).
        map(child => { return child.tree(depth + 1); });
      return render;
    }

    table (list = [], depth = 0) {
      const render = this.render();
      render.depth = depth;

      list.push(render);
      this.config.children.map(child => { return athena.store.resolve(child); }).
        forEach(child => { return child.table(list, depth + 1); });
      return list;
    }

    serialize () {
      const object = {};
      for (const item in this.config) {
        if (item.startsWith('_') ||
            this.config.propertyIsEnumerable(item) === false ||
            item === 'domain') {
          continue;
        }
        object[item] = this.config[item];
      }
      return object;
    }

    trigger (...args) {
      if (this.status.enabled) {
        this.status.triggeredAt = Date.now();

        if (this.config.behavior.trigger === 'self') {
          this.emit('trigger', ...args);
          athena.events.emit('trigger', ...args);
        } else if (this.config.behavior.trigger === 'children') {
          for (let child of this.config.children) {
            child = athena.store.resolve(child);
            if (child) {
              child.emit('trigger', ...args);
            }
          }
          athena.events.emit('trigger', ...args);
        } else if (this.config.behavior.trigger === 'all') {
          this.emit('trigger', ...args);
          for (let child of this.config.children) {
            child = athena.store.resolve(child);
            if (child) {
              child.emit('trigger', ...args);
            }
          }
          athena.events.emit('trigger', ...args);
        }
      }
    }
  }

  self.register = function(type, Constructor) {
    self[Constructor.name] = Constructor;
    nodes[type] = Constructor;
  };

  self.create = function(object, options = {}) {
    const type = object.type || 'node';
    const Constructor = nodes[type] || nodes.node;
    const node = new Constructor(object);

    athena.events.emit('created', node, object);

    if (options.link !== false && node.config.parent) {
      node.link();
    }

    return node;
  };

  self.register('node', Node);

  return self;
}

module.exports = function(athena) {
  return new Nodes(athena);
};
