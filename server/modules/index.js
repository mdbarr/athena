'use strict';

const modules = {};

class Module {
  constructor(name, dependencies, loader, resolved = false) {
    this.name = name;
    this.dependencies = dependencies;
    this.loader = loader;
    this.edges = [];
    this.resolved = resolved;
    this.loaded = false;
  }

  dependsOn(module) {
    this.edges.push(module);
  }

  resolve(resolved = [], seen = new WeakSet()) {
    if (!this.resolved) {
      for (const item of this.dependencies) {
        if (modules[item]) {
          this.dependsOn(modules[item]);
        }
      }

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
      this.resolved = resolved;
    }
    return this.resolved;
  }

  load(athena) {
    if (!this.loaded) {
      this.loader(athena);
      this.loaded = true;
    }
  }
}

module.exports = function(athena) {
  const index = require('requireindex')(__dirname);

  modules.node = new Module('node', [], () => {}, []);

  for (const key in index) {
    const item = index[key];
    let dependencies = item.dependencies || 'node';
    if (!Array.isArray(dependencies)) {
      dependencies = [ dependencies ];
    }

    const module = new Module(key, dependencies, index[key]);
    modules[key] = module;
  }

  for (const module in modules) {
    const path = modules[module].resolve();
    //console.pp(path);
    for (const item of path) {
      item.load(athena);
    }
  }

  return index;
};
