'use strict';

module.exports = function(athena) {
  class Server extends athena.nodes.Node {
    constructor({
      id, name, parent, children, address, latency = -1, icon = 'server-network', metadata
    }) {
      super({
        id,
        name,
        type: 'server',
        parent,
        children,
        icon,
        metadata
      });

      this.config.address = address;
      this.config.latency = latency;

      // Agent
      this.status.loadavg = [ 0, 0, 0 ];
      this.status.cpu = 0;
      this.status.mem = 0;
      this.status.freeMem = 0;
      this.status.processes = [];
    }
  }

  athena.nodes.register('server', Server);
};

module.exports.dependencies = 'node';
