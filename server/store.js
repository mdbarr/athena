'use strict';

const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

function Store(athena) {
  const self = this;

  const store = {};

  self.resolve = function(id) {
    if (store[id]) {
      return store[id];
    }
  };

  self.boot = function(callback) {
    callback = athena.util.callback(callback);

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
    callback();
  };

  return self;
}

module.exports = function(athena) {
  return new Store(athena);
};
