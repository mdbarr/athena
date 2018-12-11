'use strict';

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

        this.config.address = address;
        this.config.port = port;
        this.config.method = method;
        this.config.url = url;
        this.config.statusCode = statusCode;
        this.config.payload = payload;
        this.config.headers = headers;
        this.config.contentType = contentType;
        this.config.contentLength = contentLength;

        this.status.elapsed = 0;
        this.status.response = null;
      }
    }

    athena.nodes.register('http', HTTP);
  }
};
