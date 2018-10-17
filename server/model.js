'use strict';

function Model(athena) {
  const self = this;

  const node = function({
    id,
    // Instance information
    name,
    type = 'server', // Server (ping), Service (GET), Container(docker inspect???), Swarm??
    parent = 'root',
    children = [],
    address = 'inherits', // IP Address, or inherits to use parent address
    interval: 5000, // How often to check
    metadata = {}
  } = {}) {
    const model = {
      id: athena.util.id(),
      object: 'node',
      type,
      parent,
      children,
      address,
      interval,
      metadata
    };
    return model;
  }

  function status() {
    const model = {
      uptime: 0, // seconds
      health: 'healhty', // health, offline, unhealthy??
      graph: new Array(50).fill(0), //
      lastUpdate: null,
      lastChecked: null,
    };

    return model;
  }

  this.server = function({
    id, name, parent, children, address, latency = -1, metadata
  }) {

    this.model = Object.assign(node({
      id, name, type: 'server', parent, children, address, metadata
    }), {
      // server specific
      latency, // maximum response time or -1 for whatever
    });

    // Ephemeral
    this.status = status();

    this.loadavg: [ 0, 0, 0 ];
    this.cpu: 0;
    this.mem = 0;
    this.freeMem = 0;
    this.processes = [];

    return this;
  };

  this.service = function({
    id, name, type: 'service', parent, children, address,
    port = 'https', method = 'GET', url = '/', payload = false, statusCode = 200,
    contentLength = -1, // represented as minimum or -1 for whatever
    metadata
  }) {

    this.model = Object.assign(node({
      id, name, type: 'server', parent, children, address, metadata
    }), {
      // service specific
      port, // ought to be numeric (lookup)
      method,
      url,
      payload
    });

    // Ephemeral
    this.status = status();

    this.response: '', // last response body

    return this;
  };

  return self;
}

module.exports = function(athena) {
  return new Model(athena);
};
