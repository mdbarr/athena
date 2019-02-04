'use strict';

function Interval(athena, node, options, id) {
  const timeout = parseInt(options);
  const interval = setInterval(() => node.trigger(id), timeout);

  this.stop = () => clearInterval(interval);
}

module.exports = Interval;
