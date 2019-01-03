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
          self.collections.config.insertOne(athena.config, function(error, result) {
            athena.config._id = result.insertedIds[0].toString();
            callback(null, athena.config);
          });
        }
      });
    } else {
      callback();
    }
  };

  self.loadUsers = function(callback) {
    self.collections.users.find({}).toArray(function (error, results) {
      if (error || !results) {
        return callback(error);
      } else if (results.length === 0) {
        const admin = {
          name: 'Athena',
          username: 'athena',
          password: athena.util.generateLocalPassword(),
          admin: true,
          secure: false
        };
        users.athena = admin;

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
        nodes: self.db.collection('nodes'),
        users: self.db.collection('users')
      };

      // Sync config
      self.syncConfig(function() {
        self.loadUsers(function() {
          if (athena.config.mongo.autoload === false) {
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
