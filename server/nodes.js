'use strict';

const EventEmitter = require('events');

function Nodes(athena) {
  const self = this;

  //////////

  const eventProxy = function(emitter, object, eventName) {
    return new Proxy(object, {
      set: function(obj, prop, value) {
        obj[prop] = value;
        emitter.emit(eventName, object);
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
      icon = 'network',
      trigger = 'none',
      delegate = null,
      metadata = {},
      sync = true
    } = {}) {
      super();

      const node = this;

      athena.util.addPrivate(node, '_athena', athena);

      node.config = eventProxy(node, {
        id: id || athena.util.id(),
        object: 'node',
        name: name || 'Unnamed',

        type: 'node',
        parent,
        children,
        icon,
        trigger,
        delegate,
        metadata,
        sync
      }, 'config');

      node.status = eventProxy(node, {
        enabled: false,
        uptime: 0, // seconds
        health: 'healthy', // health, offline, unhealthy??
        graph: new Array(50).fill(0), //
        lastUpdate: null,
        lastChecked: null
      }, 'status');

      node.actions = {
        serialize: node.serialize,
        enable: node.enable,
        disable: node.disable
      };

      athena.util.addPrivate(node, '_cache', {
        computeTable: {}
      });

      node.computed = new Proxy({}, {
        get: function(object, property) {
          if (property === 'health') {
            const health = {
              self: node.status.health,
              aggregate: node.status.health
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
    }

    enable() {
      if (!this.enabled) {
        this.enabled = true;
      }
    }

    disable() {
      if (this.enabled) {
        this.enabled = true;
      }
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
  }

  self.register = function(type, Constructor) {
    self[Constructor.name] = Constructor;
    nodes[type] = Constructor;
  };

  self.create = function(object) {
    const type = object.type || 'node';
    const Constructor = nodes[type] || nodes.node;
    const node = new Constructor(object);

    return node;
  };

  self.register('node', Node);

  return self;
}

module.exports = function(athena) {
  return new Nodes(athena);
};
