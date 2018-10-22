'use strict';

const uuid = require('uuid/v4');
const barrkeep = require('barrkeep');

const services = {
  http: 80,
  https: 443
};

function Util() {
  const self = this;

  self.id = () => uuid();

  self.noop = () => undefined;
  self.camelize = barrkeep.camelize;
  self.clone = barrkeep.deepClone;
  self.merge = barrkeep.merge;

  self.addPrivate = function(object, name, value) {
    return Object.defineProperty(object, name, {
      value,
      enumerable: false
    });
  };

  self.service = function(name) {
    let port = parseInt(name);
    if (port !== NaN && port > 0) {
      return port;
    }
    port = services[name];
    return port || 443;
  };

  self.callback = function(callback) {
    if (callback) {
      return function(error, data) {
        setImmediate(function() {
          callback(error, data);
        });
      };
    } else {
      return self.noop;
    }
  };

  return self;
}

module.exports = function(athena) {
  return new Util(athena);
};
