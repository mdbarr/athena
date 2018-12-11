'use strict';

const CronJob = require('cron').CronJob;

function Cron(athena, node, options, id) {
  const cronjob = new CronJob(options, () => node.trigger(id));

  return cronjob;
}

module.exports = Cron;
