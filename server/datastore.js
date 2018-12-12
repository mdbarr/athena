'use strict';

const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

function DataStore(athena) {
  const self = this;

  const store = {};

  self.resolve = function(id) {
    if (store[id]) {
      return store[id];
    }
  };

  self.boot = function(callback) {
    callback = athena.util.callback(callback);

    athena.events.on('created', function(node) {
      store[node.id] = node;
    });

    self.client = new MongoClient(athena.config.database.url, {
      useNewUrlParser: true
    });

    self.client.connect(function(error) {
      assert.equal(null, error);

      self.db = self.client.db(athena.config.database.name);

      // Create ephemeral root node

      // Load nodes

      // Set linkages

      // Activate triggers

      callback(null, self.db);
    });
  };

  self.stop = function(callback) {
    callback = athena.util.callback(callback);

    self.client.close();

    for (const id in store) {
      const node = store[id];
      if (node && node.close && typeof node.close === 'function') {
        node.close();
      }
    }

    callback();
  };

  return self;
}

module.exports = function(athena) {
  return new DataStore(athena);
};
