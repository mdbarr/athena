'use strict';

const dns = require('dns');

module.exports = {
  name: 'dns',
  dependencies: 'node',
  load: function(athena) {
    class DNS extends athena.nodes.Node {
      constructor(options) {
        super(options);

        const node = this;

        const {
          hostname, address, family = 'IPv4', server
        } = options;

        node.config.type = 'dns';
        node.config.icon = 'dns';
        node.config.hostname = hostname;
        node.config.address = address;
        node.config.family = family;
        node.config.server = server || null;

        node.on('trigger', function() {
          const start = Date.now();
          dns.lookup(node.config.hostname, function(error, dnsAddress, dnsFamily) {
            let health = athena.constants.health.healthy;
            const metric = Date.now() - start;
            let description;

            if (error || !dnsAddress) {
              health = athena.constants.health.error;
            } else if (dnsAddress !== node.config.address ||
                       dnsFamily !== node.config.family) {
              health = athena.constants.health.failed;
            } else {
              description = `${ node.config.hostname }: ${ dnsAddress }`;
            }

            node.update({
              health,
              description,
              metric
            });
          });
        });
      }
    }

    athena.nodes.register('dns', DNS);
  }
};
