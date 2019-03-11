'use strict';

require('barrkeep');

function Athena() {
  const self = this;

  //////////

  self.project = require('../package');
  self.version = self.project.version;

  //////////

  self.constants = require('../common/constants');
  self.util = require('./util')(self);
  self.store = require('./datastore')(self);

  self.events = require('./events')(self);
  self.logger = require('./logger')(self);

  self.triggers = require('./triggers')(self);
  self.nodes = require('./nodes')(self);

  self.models = require('./models')(self);

  self.modules = require('./modules')(self);

  self.server = require('./server')(self);

  //////////

  self.boot = function(callback) {
    callback = self.util.callback(callback);

    console.log((self.constants.assets.banner +
                 self.constants.assets.athena).
      style(self.constants.style.blue));

    self.store.boot(() => {
      self.server.boot(() => {
        callback();
      });
    });
  };

  self.stop = function(callback) {
    callback = self.util.callback(callback);

    self.store.stop(() => {
      self.server.stop(() => {
        callback();
      });
    });
  };

  //////////

  return self;
}

module.exports = Athena;
