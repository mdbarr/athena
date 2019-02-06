'use strict';

const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

function DataStore(athena) {
  const self = this;

  const users = {};
  const store = {};

  self.resolve = function(id) {
    if (store[id]) {
      return store[id];
    }
  };

  self.find = function(object) {
    const results = [];

    for (const id in store) {
      const item = store[id];

      let match = true;
      for (const key in object) {
        if (item.config[key] !== object[key]) {
          match = false;
          break;
        }
      }

      if (match) {
        results.push(item);
      }
    }

    return results;
  };

  self.loadConfig = function(callback) {
    callback = athena.util.callback(callback);

    self.collections.config.findOne({}, function(error, config) {
      if (config) {
        athena.config = config;
        callback();
      } else {
        athena.config = require('./defaults');
        self.collections.config.insertOne(athena.config, function(error) {
          callback(error);
        });
      }
    });
  };

  self.loadUsers = function(callback) {
    self.collections.users.find({}).toArray(function (error, results) {
      if (error || !results) {
        return callback(error);
      } else if (results.length === 0) {
        const admin = athena.constants.users.admin;
        admin.password = athena.util.generateLocalPassword();
        users.athena = athena.models.user(admin);

        console.log('-'.repeat(80));
        console.log('\nLocal administrator account configured as:');
        console.log('  username: %s\n  password: %s\n', admin.username, admin.password);
        console.log('-'.repeat(80));
      } else {
        for (const user of results) {
          users[user.username] = user;
        }
      }
      callback();
    });
  };

  self.boot = function(callback) {
    callback = athena.util.callback(callback);

    const mongoUrl = process.env.ATHENA_MONGO_URL ||
          'mongodb://localhost:27017';
    const mongoDB = process.env.ATHENA_MONGO_DB ||
          'athena';

    athena.events.on('created', function(node) {
      store[node.config.id] = node;
    });

    self.client = new MongoClient(mongoUrl, {
      useNewUrlParser: true
    });

    self.client.connect(function(error) {
      assert.equal(null, error);

      self.db = self.client.db(mongoDB);
      self.collections = {
        config: self.db.collection('config'),
        nodes: self.db.collection('nodes'),
        users: self.db.collection('users')
      };

      self.loadConfig(function() {
        self.loadUsers(function() {
          if (athena.config.autoload === false) {
            return callback();
          }

          // Create ephemeral root node
          athena.nodes.create(athena.constants.nodes.root);

          // Create ephemeral Athena node
          athena.nodes.create(athena.constants.nodes.athena);

          // Load nodes
          self.collections.nodes.find({}).forEach(function(node) {
            athena.nodes.create(node, {
              link: false
            });
          }, function(findError) {
            assert.equal(null, findError);

            // Set linkages
            for (const id in store) {
              store[id].link();
            }

            // Enable nodes
            for (const id in store) {
              store[id].enable();
            }

            // Activate triggers
            for (const id in store) {
              store[id].activate();
            }

            callback();
          });
        });
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
