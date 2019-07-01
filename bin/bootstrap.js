'use strict';

const assert = require('assert');
const Athena = require('../server/athena');
const MongoClient = require('mongodb').MongoClient;

function bootstrap(options) {
  const athena = new Athena();
  athena.config = require('../server/defaults')

  athena.config.mongo = {
    url: process.env.ATHENA_MONGO_URL || 'mongodb://localhost:27017',
    db: process.env.ATHENA_MONGO_DB || 'athena'
  };

  const data = require(`../${ options.data }`);

  const client = new MongoClient(athena.config.mongo.url, { useNewUrlParser: true });

  client.connect((error) => {
    assert.equal(null, error);

    const db = client.db(athena.config.mongo.db);
    const nodes = db.collection('nodes');
    const users = db.collection('users');
    const conf = db.collection('config');

    const counts = {
      users: 0,
      nodes: 0
    };

    //////////

    function drop(callback) {
      callback = athena.util.callback(callback);

      if (options.drop) {
        return conf.drop(() => {
          nodes.drop(() => {
            users.drop(() => {
              console.log('Dropped users and nodes collections.');
              return callback();
            });
          });
        });
      }
      return callback();
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
        return users.insertMany(items, (error, result) => {
          assert.equal(null, error);
          counts.users = result.insertedCount;
          return callback();
        });
      }
      return callback();
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

        return nodes.insertMany(list, (error, result) => {
          assert.equal(null, error);
          counts.nodes = result.insertedCount;
          return callback();
        });
      }
      return callback();
    }

    //////////

    drop(() => {
      loadUsers(data.users, () => {
        if (counts.users) {
          console.log('Inserted %d users.', counts.users);
        }
        loadNodes(data.nodes, () => {
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
