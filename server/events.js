'use strict';

const EventEmitter = require('events');

function Events(athena) {
  const self = this;

  const emitter = new EventEmitter();

  self.on = emitter.on;
  self.off = emitter.off;
  self.once = emitter.once;

  self.emit = function(eventName, ...args) {
    athena.logger.log({
      id: athena.util.id(),
      event: eventName,
      args
    });

    emitter.emit.apply(this, [ eventName, ...args ]);
  };

  return self;
}

module.exports = function(athena) {
  return new Events(athena);
};
