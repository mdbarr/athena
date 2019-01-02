'use strict';

const EventEmitter = require('events');

function Nodes(athena) {
  const self = this;

  //////////

  const eventProxy = function(emitter, object, eventName) {
    return new Proxy(object, {
      set: function(obj, prop, value) {
        obj[prop] = value;
        if (emitter.status.enabled) {
          emitter.emit(eventName, object);
          athena.events.emit(eventName, object);
        }
        return true;
      }
    });
  };

  //////////

  const nodes = {};

  class Node extends EventEmitter {
    constructor({
      id,
      name,
      parent = 'root',
      children = [],
      icon = 'network-outline',
      triggers = [],
      delegate = null,
      metadata = {},
      ephemeral = false,
      sync = true,
      container = false
    } = {}) {
      super();

      const node = this;

      if (id && parent === id) {
        parent = null;
      }

      athena.util.addPrivate(node, '_athena', athena);

      node.config = eventProxy(node, {
        id: id || athena.util.id(),
        object: 'node',
        name: name || 'Unnamed',

        type: 'node',
        parent,
        children,
        icon,
        triggers,
        delegate,
        metadata,
        sync,
        ephemeral,
        container
      }, 'config');

      node.id = node.config.id;

      node.status = {
        enabled: false,
        active: false,
        uptime: 0,
        health: athena.constants.health.unknown,
        graph: new Array(50).fill(0),
        updatedAt: null,
        triggeredAt: null,
        aggregate: []
      };

      node.actions = {
        enable: {
          tooltip: 'Enable node',
          icon: 'play',
          call: node.enable.bind(node),
          available: () => !node.status.enabled
        },
        disable: {
          tooltip: 'Disable node',
          icon: 'stop',
          call: node.disable.bind(node),
          available: () => node.status.enabled
        },
        trigger: {
          tooltip: 'Trigger node',
          icon: 'update',
          call: node.trigger.bind(node),
          available: () => node.status.enabled
        }
      };

      athena.util.addPrivate(node, '_cache', {
        computeTable: {}
      });

      node.computed = new Proxy({}, {
        get: function(object, property) {
          if (property === 'health') {
            const health = {
              self: node.status.health,
              aggregate: node.status.aggregate
            };
            return health;
          } else if (property === 'parent') {
            if (!node._cache.parent) {
              node._cache.parent = athena.store.resolve(node.parent);
            }
            return node._cache.parent;
          } else if (property === 'children') {
            if (!node._cache.children) {
              node._cache.children = node.children.map((x) => athena.store.resolve(x));
            }
            return node._cache.children;
          } else if (node._cache.computeTable[property] &&
                     typeof node._cache.computeTable[property] === 'function') {
            return node._cache.computeTable[property](object, property);
          }
        },
        set: function(object, property, value) {
          if (typeof value === 'function') {
            node._cache.computeTable[property] = value;
          }
        }
      });

      node.on('config', function() {
        node.id = node.config.id;
        if (node.status.enabled && !node.config.ephemeral) {
          node.save();
        }
      });
    }

    enable() {
      if (!this.status.enabled) {
        this.status.enabled = true;
      }
    }

    disable() {
      if (this.status.enabled) {
        this.status.enabled = true;
      }
    }

    activate() {
      if (!this.status.active) {
        athena.triggers.activate(this);
        this.status.active = true;
      }
    }

    deactivate() {
      if (this.status.active) {
        athena.triggers.deactivate(this);
        this.status.active = false;
      }
    }

    update({
      health, description, metric
    }) {
      if (health !== undefined) {
        this.status.health = health;
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

    save() {
      this.emit('save', this.serialize());
    }

    addChild(child) {
      const node = this;
      const childId = node.config.children.length;

      child.on('status', function() {
        if (child.enabled) {
          node.status.aggregate[childId] = child.status.health;
          node.emit('status', child, child.status);
          athena.events.emit('status', node, node.status);
        }
      });

      node.config.children.push(child.id);
    }

    link() {
      if (this.config.parent && !this._linked) {
        const parent = athena.store.resolve(this.config.parent);
        parent.addChild(this);
        athena.util.addPrivate(this, '_parent', parent);
        athena.events.emit('linked', this, parent);
        this._linked = true;
      }
    }

    describe() {
      return {
        name: 'String',
        parent: 'String',
        icon: 'String',
        triggers: 'Array',
        metadata: 'Object',
        sync: 'Boolean'
      };
    }

    render() {
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
      for (const item in this.status) {
        if (item.startsWith('_') ||
            this.status.propertyIsEnumerable(item) === false ||
            item === 'domain') {
          continue;
        }
        object.status[item] = this.status[item];
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

    serialize() {
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

    trigger(...args) {
      if (this.status.enabled) {
        this.status.triggeredAt = Date.now();
        this.emit('trigger', ...args);
        athena.events.emit('trigger', ...args);
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
