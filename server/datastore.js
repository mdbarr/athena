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

  self.syncConfig = function(callback) {
    callback = athena.util.callback(callback);

    if (athena.config.mongo.sync) {
      self.collections.config.findOne({}, function(error, config) {
        if (config) {
          athena.config = Object.merge(athena.config, config);
          self.collections.config.updateOne({
            _id: athena.config._id
          },
          {
            $set: athena.config
          },
          {
            upsert: true
          },
          callback);
        } else {
          self.collections.config.insert(athena.config, function(error, result) {
            athena.config._id = result.insertedIds[0].toString();
            callback(null, athena.config);
          });
        }
      });
    } else {
      callback();
    }
  };

  self.boot = function(callback) {
    callback = athena.util.callback(callback);

    athena.events.on('created', function(node) {
      store[node.config.id] = node;
    });

    self.client = new MongoClient(athena.config.mongo.url, {
      useNewUrlParser: true
    });

    self.client.connect(function(error) {
      assert.equal(null, error);

      self.db = self.client.db(athena.config.mongo.db);
      self.collections = {
        config: self.db.collection('config'),
        nodes: self.db.collection('nodes')
      };

      // Sync config
      self.syncConfig(function() {
        if (athena.config.mongo.autoload === false) {
          return callback();
        }

        // Create ephemeral root node
        athena.nodes.create(athena.constants.nodes.root);

        // Create ephemeral Athena node
        athena.nodes.create(athena.constants.nodes.athena);

        // Load nodes

        // Set linkages

        // Activate triggers
        for (const id in store) {
          store[id].activate();
        }

        callback();
      });
    });
  };

  self.stop = function(callback) {
    callback = athena.util.callback(callback);

    self.client.close(function() {
      for (const id in store) {
        const node = store[id];

        node.deactivate();

        if (node && node.stop && typeof node.stop === 'function') {
          node.stop();
        }
      }

      callback();
    });
  };

  return self;
}

module.exports = function(athena) {
  return new DataStore(athena);
};
