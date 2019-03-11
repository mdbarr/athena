'use strict';

function Interval(athena, node, options, id) {
  const timeout = parseInt(options, 10);
  const interval = setInterval(() => { return node.trigger(id); }, timeout);

  this.stop = () => { return clearInterval(interval); };
}

module.exports = Interval;
