'use strict';

const net = require('net');
const ping = require ('net-ping');

module.exports = {
  name: 'ping',
  dependencies: 'node',
  load: function(athena) {
    class Ping extends athena.nodes.Node {
      constructor({
        id, name, parent, children, address, latency = -1,
        icon = 'server-network', triggers, metadata
      }) {
        if (!net.isIP(address)) {
          throw new Error('Address is not an IP address');
        }

        super({
          id,
          name,
          parent,
          children,
          icon,
          triggers,
          metadata
        });

        const node = this;

        this.config.type = 'ping';

        this.config.address = address;
        this.config.latency = latency;

        this.session = ping.createSession();

        this.on('trigger', function() {
          console.pp('TRIGGERED');
          node.session.pingHost(node.config.address, function (error, target, sent, rcvd) {
            let health = athena.constants.health.healthy;
            let metric = 0;

            if (error) {
              health = athena.constants.health.error;
            } else {
              const time = rcvd.getTime() - sent.getTime();
              metric = time;
              if (node.latency > 0 && time > node.latency) {
                health = athena.constants.health.failedl;
              }
            }
            node.actions.update({
              health,
              metric
            });
          });
        });
      }

      close() {
        this.session.close();
      }
    }

    athena.nodes.register('ping', Ping);
  }
};
