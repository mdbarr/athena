'use strict';

function Interval(athena, node, options, id) {
  const timeout = parseInt(options);

  const interval = setInterval(() => node.trigger(id), timeout);

  interval.stop = () => interval.clearInterval();

  return interval;
}

module.exports = Interval;
