'use strict';

require('barrkeep');

const defaults = {
  object: 'config',
  api: {
    enabled: true,
    host: '0.0.0.0',
    port: 6250,
    available: true
  },
  datastore: 'mongo',
  mongo: {
    url: process.env.ATHENA_MONGO_URL ||
      'mongodb://localhost:27017',
    db: process.env.ATHENA_MONGO_DB ||
      'athena',
    sync: true,
    autoload: true
  },
  log: {
    enabled: false,
    console: false,
    file: 'athena.log'
  }
};

function Athena(config = {}) {
  const self = this;

  //////////

  self.project = require('../package');
  self.version = self.project.version;
  self.constants = require('../common/constants');

  //////////

  self.config = Object.merge(defaults, config);

  //////////

  self.util = require('./util')(self);
  self.logger = require('./logger')(self);
  self.events = require('./events')(self);
  self.store = require('./datastore')(self);
  self.triggers = require('./triggers')(self);
  self.nodes = require('./nodes')(self);
  self.models = require('./models')(self);
  self.server = require('./server')(self);
  self.modules = require('./modules')(self);

  //////////

  self.boot = function(callback) {
    callback = self.util.callback(callback);

    console.log((self.constants.assets.banner +
                 self.constants.assets.athena).
      style(self.constants.style.blue));

    // Load all models from database
    self.store.boot(function() {
      self.server.boot(function() {
        callback();
      });
    });
  };

  self.stop = function(callback) {
    callback = self.util.callback(callback);

    self.store.stop(function() {
      self.server.stop(function() {
        callback();
      });
    });
  };

  //////////

  return self;
}

module.exports = Athena;
