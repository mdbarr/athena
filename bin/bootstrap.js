'use strict';

const fs = require('fs');
const assert = require('assert');
const Athena = require('../server/athena');
const MongoClient = require('mongodb').MongoClient;

function bootstrap(options) {
  let config = {};
  if (options.config) {
    config = JSON.parse(fs.readFileSync(options.config));
  }

  const athena = new Athena(config);

  const data = require('../' + options.file);

  const client = new MongoClient(athena.config.mongo.url, {
    useNewUrlParser: true
  });

  client.connect(function(error) {
    assert.equal(null, error);

    const db = client.db(athena.config.mongo.db);
    const nodes = db.collection('nodes');
    const users = db.collection('users');

    const counts = {
      users: 0,
      nodes: 0
    };

    //////////

    function drop(callback) {
      callback = athena.util.callback(callback);

      if (options.drop) {
        nodes.drop(function() {
          users.drop(function() {
            console.log('Dropped users and nodes collections.');
            callback();
          });
        });
      } else {
        callback();
      }
    }

    function loadUsers(items, callback) {
      callback = athena.util.callback(callback);

      for (const user of items) {
        if (!user.secure) {
          user.password = athena.util.sha256(user.password);
          user.secure = true;
        }
      }

      if (items && items.length) {
        users.insertMany(items, function(error, result) {
          assert.equal(null, error);
          counts.users = result.insertedCount;
          callback();
        });
      } else {
        callback();
      }
    }

    function loadNodes(items, callback) {
      callback = athena.util.callback(callback);

      if (items && items.length) {
        const list = [];

        for (const node of items) {
          if (!node.id) {
            node.id = athena.util.id();
          }

          list.push(node);

          if (node.children && node.children.length) {
            const children = node.children;
            delete node.children;

            for (const child of children) {
              if (!child.id) {
                child.id = athena.util.id();
              }

              child.parent = node.id;
              list.push(child);
            }
          }
        }

        nodes.insertMany(list, function(error, result) {
          assert.equal(null, error);
          counts.nodes = result.insertedCount;
          callback();
        });
      } else {
        callback();
      }
    }

    //////////

    drop(function() {
      loadUsers(data.users, function() {
        if (counts.users) {
          console.log('Inserted %d users.', counts.users);
        }
        loadNodes(data.nodes, function() {
          if (counts.nodes) {
            console.log('Inserted %d nodes.', counts.nodes);
          }

          console.log('Done!');
          process.exit(0);
        });
      });
    });
  });
}

module.exports = bootstrap;
