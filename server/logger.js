'use strict';

const fs = require('fs');

function Logger (athena) {
  const self = this;

  self.log = function(event, callback) {
    callback = athena.util.callback(callback);

    if (athena.config && athena.config.log && athena.config.log.enabled) {
      const item = {
        id: event.id,
        event: event.event
      };

      if (athena.config.log.console) {
        console.pp(item);
      }

      if (!athena.config.log.file) {
        return fs.appendFile(athena.config.log.file,
          `${ JSON.stringify(item, null, 2) }\n`,
          callback);
      }
      return callback();
    }
    return callback();
  };

  return self;
}

module.exports = function(athena) {
  return new Logger(athena);
};
