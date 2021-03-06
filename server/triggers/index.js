'use strict';

function Triggers (athena) {
  const self = this;

  const triggers = require('requireindex')(__dirname);

  self.activate = function(node) {
    node.triggers = node.triggers || {};

    if (node.config.triggers && Array.isArray(node.config.triggers)) {
      for (const trigger of node.config.triggers) {
        if (trigger === 'none') {
          continue;
        }

        const [ , type, options ] = trigger.match(/^(.*?):+(.*)$/);

        if (triggers[type]) {
          const id = athena.util.id();
          const Trigger = triggers[type];

          node.triggers[id] = new Trigger(athena, node, options, id);

          athena.events.emit('activate', type, options, id);
        } else {
          console.log('Unknown Trigger Type', type, options);
        }
      }
    }
  };

  self.deactivate = function(node) {
    if (node.triggers) {
      for (const id in node.triggers) {
        node.triggers[id].stop();
      }
    }
  };

  return self;
}

module.exports = function(athena) {
  return new Triggers(athena);
};
