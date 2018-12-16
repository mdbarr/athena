'use strict';

const fs = require('fs');

function Logger(athena) {
  const self = this;

  self.log = function(event, callback) {
    callback = athena.util.callback(callback);
    if (athena.config.log.enabled) {

      if (athena.config.log.console) {
        console.pp({
          id: event.id,
          event: event.event
        });
      }

      if (athena.config.log.file) {
        fs.appendFile(athena.config.log.file,
          JSON.stringify(event, null, 2) + '\n',
          callback);
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  return self;
}

module.exports = function(athena) {
  return new Logger(athena);
};
