'use strict';

const CronJob = require('cron').CronJob;

function Cron(athena, node, options, id) {
  const cronjob = new CronJob(options, () => node.trigger(id));
  cronjob.start();

  this.stop = () => cronjob.stop();
}

module.exports = Cron;
