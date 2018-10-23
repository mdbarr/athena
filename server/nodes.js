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
      metadata = {},
      sync = true
    } = {}) {
      super();

      const node = this;

      athena.util.addPrivate(node, 'athena', athena);

      node.id = id || athena.util.id();
      node.object = 'node';
      node.name = name || 'Unnamed';
      node.type = 'node';
      node.parent = parent;
      node.children = children;
      node.icon = icon;
      node.metadata = metadata;
      node.sync = sync;

      athena.util.addPrivate(node, 'status', eventProxy(node, {
        uptime: 0, // seconds
        health: 'healthy', // health, offline, unhealthy??
        graph: new Array(50).fill(0), //
        lastUpdate: null,
        lastChecked: null
      }, 'status'));

      athena.util.addPrivate(node, '_cache');
      athena.util.addPrivate(node, 'computed', {
        get parent() {
          if (!node._cache.parent) {
            node._cache.parent = athena.store.resolve(node.parent);
          }
          return node._cache.parent;
        },
        get children() {
          if (!node._cache.children) {
            node._cache.children = node.children.map((x) => athena.store.resolve(x));
          }
          return node._cache.children;
        }
      });
    }

    serialize() {
      const object = {};
      for (const item in this) {
        if (item.startsWith('_') ||
            this.propertyIsEnumerable(item) === false ||
            item === 'domain') {
          continue;
        }
        object[item] = this[item];
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

    return eventProxy(node, node, 'changed');
  };

  self.register('node', Node);

  return self;
}

module.exports = function(athena) {
  return new Nodes(athena);
};
