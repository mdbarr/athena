'use strict';

const os = require('os');

module.exports = {
  name: 'athena',
  load(athena) {
    class Athena extends athena.nodes.Node {
      constructor(options = {}) {
        super(options);
        const node = this;

        const hostname = os.hostname().replace(/\..*$/, '');

        node.config.name = options.name ? `${ options.name } (${ hostname })` : hostname;
        node.config.type = 'athena';
        node.config.icon = 'athena';
        node.config.typeIcon = 'athena';

        node.status.health = athena.constants.health.healthy;

        node.on('trigger', () => {
          const loadavg = os.loadavg();
          const metric = Number(loadavg[0].toFixed(2));

          let freeMemory = os.freemem();
          const percentMemory = Math.floor(freeMemory / os.totalmem() * 100);
          freeMemory = athena.util.formatBytes(freeMemory);

          const clients = Object.keys(athena.server.clients).length;

          const description = `${ hostname } - ${ os.type() } ${ os.arch() }<br>
<i class="mdi mdi-memory"></i> ${ freeMemory } (${ percentMemory }%)<br>
${ clients } connected clients`;

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
