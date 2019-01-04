'use strict';

const os = require('os');

module.exports = {
  name: 'athena',
  load: function(athena) {
    class Athena extends athena.nodes.Node {
      constructor(options = {}) {
        super(options);
        const node = this;

        node.config.name = os.hostname().replace(/\..*$/, '');
        node.config.type = 'athena';
        node.config.icon = 'athena';

        node.status.health = athena.constants.health.healthy;

        node.on('trigger', function() {
          const loadavg = os.loadavg();
          const metric = Number(loadavg[0].toFixed(2));

          let freeMemory = os.freemem();
          const percentMemory = Math.floor((freeMemory / os.totalmem()) * 100);
          freeMemory = athena.util.formatBytes(freeMemory);

          const clients = Object.keys(athena.server.clients).length;

          const description = `${ os.hostname() } - ${ os.type() } ${ os.arch() }<br>Free Memory: ${ freeMemory } (${ percentMemory }%)<br>${ clients } connected clients`;

          node.update({
            health: athena.constants.health.healthy,
            description,
            metric
          });
        });

        node.emit('trigger');
      }
    }

    athena.nodes.register('athena', Athena);
  }
};
