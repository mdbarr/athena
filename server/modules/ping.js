'use strict';

const net = require('net');
const ping = require ('net-ping');

module.exports = {
  name: 'ping',
  dependencies: 'node',
  load: function(athena) {
    class Ping extends athena.nodes.Node {
      constructor(options) {
        const {
          address, latency
        } = options;

        if (!net.isIP(address)) {
          throw new Error('Address is not an IP address');
        }

        super(options);

        const node = this;

        this.config.type = 'ping';

        this.config.address = address;
        this.config.latency = latency;

        this.session = ping.createSession();

        this.on('trigger', function() {
          node.session.pingHost(node.config.address, function (error, target, sent, rcvd) {
            let health = athena.constants.health.healthy;
            let metric = 0;

            if (error) {
              health = athena.constants.health.error;
            } else if (!rcvd) {
              metric = -30;
              health = athena.constants.health.failed;
            } else {
              const time = rcvd.getTime() - sent.getTime();
              metric = time;
              if (node.latency > 0 && time > node.latency) {
                health = athena.constants.health.failed;
              }
            }
            node.update({
              health,
              metric
            });
          });
        });
      }

      stop() {
        this.session.close();
      }
    }

    athena.nodes.register('ping', Ping);
  }
};
