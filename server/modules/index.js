'use strict';

const modules = {};

const moduleRegExp = /^athena-module-(.*)$/;

const fields = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies'
];

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
  // Built-in modules
  const index = require('requireindex')(__dirname);

  // Contrib modules
  for (const field of fields) {
    if (athena.project[field]) {
      for (const key in athena.project[field]) {
        if (moduleRegExp.test(key)) {
          index[key] = require(key);
        }
      }
    }
  }

  // Handle multiple modules in one file
  for (const key in index) {
    const module = index[key];

    if (Array.isArray(module)) {
      delete index[key];

      for (const item of module) {
        if (item.name) {
          index[item.name] = item;
        }
      }
    }
  }

  // Dependency resolver
  modules.node = new Module('node', [], () => {}, []);

  for (const key in index) {
    const item = index[key];

    if (!item.name && !item.load) {
      continue;
    }

    let dependencies = item.dependencies || 'node';
    if (!Array.isArray(dependencies)) {
      dependencies = [ dependencies ];
    }

    const module = new Module(item.name, dependencies, item.load);
    modules[item.name] = module;
  }

  for (const module in modules) {
    const path = modules[module].resolve();

    for (const item of path) {
      item.load(athena);
    }
  }

  return index;
};
