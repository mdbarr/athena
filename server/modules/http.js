'use strict';

const request = require('request');

module.exports = {
  name: 'http',
  dependencies: 'node',
  load: function(athena) {
    class HTTP extends athena.nodes.Node {
      constructor({
        id, name, parent, children, address, port = 443, icon = 'web',
        triggers, metadata, method = 'GET', url, statusCode = 200,
        payload = null, headers = {}, contentType = 'text/html',
        contentLength = -1
      }) {
        super({
          id,
          name,
          type: 'http',
          parent,
          children,
          icon,
          triggers,
          metadata
        });

        const node = this;

        node.config.address = address;
        node.config.port = port;
        node.config.method = method;
        node.config.url = url;
        node.config.statusCode = statusCode;
        node.config.payload = payload;
        node.config.headers = headers;
        node.config.contentType = contentType;
        node.config.contentLength = contentLength;

        node.status.elapsed = 0;
        node.status.response = null;

        const options = {
          method: node.config.method,
          url: node.config.url,
          headers: node.config.headers,
          time: true
        };

        node.on('trigger', function() {
          request(options, function(error, response) {
            let health = athena.constants.health.healthy;
            let metric = 0;

            if (error || !response) {
              health = athena.constants.health.error;
            } else {
              if (response.statusCode !== node.config.statusCode) {
                health = athena.constants.health.failed;
              }

              metric = response.elapsedTime;
            }

            node.update({
              health,
              metric
            });
          });
        });
      }
    }

    athena.nodes.register('http', HTTP);
  }
};
