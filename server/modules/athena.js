'use strict';

const os = require('os');

module.exports = {
  name: 'athena',
  load: function(athena) {
    class Athena extends athena.nodes.Node {
      constructor(options) {
        super(options);
        const node = this;

        node.config.name = os.hostname();
        node.config.type = 'athena';
        node.config.icon = 'athena';

        node.status.health = athena.constants.health.healthy;

        node.on('trigger', function() {
          const loadavg = os.loadavg();
          const metric = Number(loadavg[0].toFixed(2));

          node.actions.update({
            health: athena.constants.health.healthy,
            description: 'Online',
            metric
          });
        });
      }
    }

    athena.nodes.register('athena', Athena);
  }
};
