'use strict';

class Module {
  constructor(name, loader) {
    this.name = name;
    this.loader = loader;
    this.edges = [];
  }

  dependsOn(module) {
    this.edges.push(module);
  }

  resolve(resolved = [], seen = new WeakSet()) {
    console.log(this.name);
    seen.add(this);
    for (const edge of this.edges) {
      if (!resolved.includes(edge)) {
        if (seen.has(edge)) {
          console.log('Circular reference detected: %s -> %s', this.name, edge.name);
          throw new Error('Circular reference');
        }

        edge.resolve(resolved, seen);
      }
    }
    resolved.push(this);
    return resolved;
  }
}

module.exports = function(athena) {
  const index = require('requireindex')(__dirname);

  const node = new Module('node', () => {});
  const modules = [ node ];

  for (const key in index) {
    const module = new Module(key, index[key]);
    modules.push(module);

    if (typeof index[key] === 'function') {
      index[key] = index[key](athena);
    }
  }

  return index;
};
