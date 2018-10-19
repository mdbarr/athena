'use strict';

require('barrkeep');

const defaults = {};

function Athena(config = {}) {
  const self = this;

  //////////

  self.version = require('../package').version;
  self.config = Object.merge(defaults, config);

  //////////

  self.util = require('./util')(self);
  self.models = require('./models')(self);
  self.modules = require('./modules')(self);

  self.store = {};

  //////////

  //
  self.boot = function() {
    // Load all models from database

    // Start check on each node (setInterval, queue/setInterval, setTimeout -> setTimeout)
  };

  //////////

  return self;
}

module.exports = Athena;
