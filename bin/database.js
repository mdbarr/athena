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

    if (options.drop) {
      nodes.drop(function(error) {
        assert.equal(null, error);

        nodes.insertMany(data, function(error) {
          assert.equal(null, error);
          process.exit(0);
        });
      });
    } else {
      nodes.insertMany(data, function(error) {
        assert.equal(null, error);
        process.exit(0);
      });
    }
  });
}

module.exports = {
  bootstrap
};
