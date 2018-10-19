'use strict';

const uuid = require('uuid/v4');

const services = {
  http: 80,
  https: 443
};

function Util() {
  this.id = () => uuid();

  this.addPrivate = function(object, name, value) {
    return Object.defineProperty(object, name, {
      value,
      enumerable: false
    });
  };

  this.service = function(name) {
    let port = parseInt(name);
    if (port !== NaN && port > 0) {
      return port;
    }
    port = services[name];
    return port || 443;
  };
}

module.exports = function(athena) {
  return new Util(athena);
};
