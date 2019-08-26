'use strict';

const os = require('os');
const uuid = require('uuid/v4');
const crypto = require('crypto');
const barrkeep = require('barrkeep');

const services = {
  http: 80,
  https: 443
};

function Util () {
  const self = this;

  self.id = () => { return uuid(); };

  self.noop = () => { return undefined; };
  self.camelize = barrkeep.camelize;
  self.clone = barrkeep.deepClone;
  self.merge = barrkeep.merge;

  self.formatBytes = barrkeep.formatBytes;

  self.addPrivate = function(object, name, value) {
    return Object.defineProperty(object, name, {
      value,
      enumerable: false
    });
  };

  self.service = function(name) {
    let port = parseInt(name, 10);
    if (!isNaN(port) && port > 0) {
      return port;
    }
    port = services[name];
    return port || 443;
  };

  self.callback = function(callback) {
    if (callback) {
      return function(error, data) {
        setImmediate(() => {
          callback(error, data);
        });
      };
    }
    return self.noop;
  };

  self.computeHash = function(input, hash = 'sha1') {
    if (typeof input !== 'string') {
      input = JSON.stringify(input);
    }
    return crypto.createHash(hash).update(input).
      digest('hex');
  };

  self.sha256 = function(input) {
    return self.computeHash(input, 'sha256');
  };

  self.timestamp = function(date) {
    if (date) {
      return new Date(date).getTime();
    }
    return Date.now();
  };

  self.generateLocalPassword = function() {
    let localPassword = (`${ os.type() }/${ os.arch() }/${ os.platform() }/${ os.release() }-` +
                         `${ os.cpus().map((item) => { return item.model; }) }:` +
                         `${ os.totalmem() }-${ os.hostname() }:${ os.homedir() }>` +
                         `${ JSON.stringify(os.userInfo()) }`).
      replace(/\s+/g, ' ').replace(/["']/g, '');
    localPassword = self.sha256(localPassword).substring(0, 24);
    return localPassword;
  };

  self.precisionRound = function(number, precision = 2) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  };

  return self;
}

module.exports = function(athena) {
  return new Util(athena);
};
