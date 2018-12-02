'use strict';

module.exports = function(athena) {

  class HTTP extends athena.nodes.Node {
    constructor({
      id, name, parent, children, address, port = 443, icon = 'web', metadata,
      method = 'GET', url, statusCode = 200, payload = null, headers = {},
      contentType = 'text/html', contentLength = -1
    }) {
      super({
        id,
        name,
        type: 'http',
        parent,
        children,
        icon,
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
  athena.nodes.register('https', HTTP);

  class API extends HTTP {
    constructor({
      id, name, parent, children, address, port = 443, icon = 'cloud-braces', metadata,
      method = 'GET', url, statusCode = 200, payload = null, headers = {},
      contentType = 'application/json', contentLength = -1
    }) {
      super({
        id,
        name,
        parent,
        children,
        address,
        port,
        icon,
        metadata,
        method,
        url,
        statusCode,
        payload,
        headers,
        contentType,
        contentLength
      });

      this.config.type = 'api';
    }
  }

  athena.nodes.register('api', API);
};

module.exports.dependencies = 'node';
