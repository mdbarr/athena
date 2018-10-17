'use strict';

function Athena(config = {}) {
  const self = this;

  //////////

  self.util = require('./util')(self);
  self.model require('./model')(self);

  //////////

  //
  self.boot = function() {
    // Load all models from database

    // Start check on each node
  };

  //////////

  return self;
}

module.exports = Athena;
