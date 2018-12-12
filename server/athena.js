'use strict';

require('barrkeep');

const defaults = {
  datastore: 'mongo',
  mongo: {
    url: 'mongodb://localhost:27017',
    db: 'athena'
  },
  log: {
    enabled: true,
    file: 'athena.log'
  }
};

function Athena(config = {}) {
  const self = this;

  //////////

  self.project = require('../package');
  self.version = self.project.version;
  self.config = Object.merge(defaults, config);

  //////////

  self.util = require('./util')(self);
  self.logger = require('./logger')(self);
  self.events = require('./events')(self);
  self.store = require('./datastore')(self);
  self.triggers = require('./triggers')(self);
  self.nodes = require('./nodes')(self);
  self.models = require('./models')(self);
  self.modules = require('./modules')(self);

  //////////

  self.boot = function(callback) {
    callback = self.util.callback(callback);

    // Load all models from database
    self.store.boot(function(error) {

      // Start check on each node (setInterval, queue/setInterval, setTimeout -> setTimeout)
      callback(error);
    });
  };

  self.stop = function(callback) {
    callback = self.util.callback(callback);
    self.store.stop();
    callback();
  };

  //////////

  return self;
}

module.exports = Athena;
