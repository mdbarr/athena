'use strict';

const CronJob = require('cron').CronJob;

function Cron(athena, node, options, id) {
  const cronjob = new CronJob(options, () => { return node.trigger(id); });
  cronjob.start();

  this.stop = () => { return cronjob.stop(); };
}

module.exports = Cron;
