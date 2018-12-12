'use strict';

const net = require('net');
const ping = require ('net-ping');

module.exports = {
  name: 'server',
  dependencies: 'node',
  load: function(athena) {
    class Server extends athena.nodes.Node {
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

        this.config.type = 'server';

        this.config.address = address;
        this.config.latency = latency;

        // Agent
        this.status.loadavg = [ 0, 0, 0 ];
        this.status.cpu = 0;
        this.status.mem = 0;
        this.status.freeMem = 0;
        this.status.processes = [];

        this.session = ping.createSession();

        this.on('trigger', function() {
          this.session.pingHost(this.address, function (error, target, sent, rcvd) {
            if (error) {
              // hard fail
            } else {
              const time = rcvd.getTime() - sent.getTime();
              if (this.latency > 0 && time > this.latency) {
                // soft fail
              }
            }
          });
        });
      }

      close() {
        this.session.close();
      }
    }

    athena.nodes.register('server', Server);
  }
};
