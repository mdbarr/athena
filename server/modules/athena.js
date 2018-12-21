'use strict';

const os = require('os');

module.exports = {
  name: 'athena',
  load: function(athena) {
    class Athena extends athena.nodes.Node {
      constructor(options) {
        super(options);
        const node = this;

        node.config.type = 'athena';
        node.config.icon = 'athena';

        node.status.health = athena.constants.health.healthy;

        node.on('trigger', function() {
          console.log('triggered');
          const loadavg = os.loadavg();
          const metric = loadavg[0];

          node.actions.update({
            health: athena.constants.health.healthy,
            metric
          });
        });
      }
    }

    athena.nodes.register('athena', Athena);
  }
};
