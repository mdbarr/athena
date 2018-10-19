'use strict';

const EventEmitter = require('events');

function Models(athena) {
  const self = this;

  //////////

  class Node extends EventEmitter {
    constructor({
      id,
      name,
      parent = 'root',
      children = [],
      icon = 'network',
      metadata = {}
    } = {}) {
      super();

      athena.util.addPrivate(this, 'athena', athena);

      this.id = id || athena.util.id();
      this.object = 'node';
      this.name = name || 'Unnamed';
      this.type = 'node';
      this.parent = parent;
      this.children = children;
      this.icon = icon;
      this.metadata = metadata;

      athena.util.addPrivate(this, 'status', {
        uptime: 0, // seconds
        health: 'healthy', // health, offline, unhealthy??
        graph: new Array(50).fill(0), //
        lastUpdate: null,
        lastChecked: null
      });

      athena.util.addPrivate(this, 'computed', {
        get parent() {
          return athena.store.resolve(this.parent);
        },
        get children() {
          return this.children.map((x) => athena.store.resolve(x));
        }
      });
    }

    serialize() {
      const object = {};
      for (const item of this) {
        object[item] = this[item];
      }
      return object;
    }
  }

  const nodes = {
    node: Node
  };

  this.node = {};
  this.node.register = function(type, Constructor) {
    nodes[type] = Constructor;
  };

  this.node.create = function(object) {
    const type = object.type || 'node';
    const Constructor = nodes[type] || nodes.node;
    return new Constructor(object);
  };

  //////////

  return self;
}

module.exports = function(athena) {
  return new Models(athena);
};
