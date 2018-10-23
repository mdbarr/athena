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

      this.address = address;
      this.port = port;
      this.method = method;
      this.url = url;
      this.statusCode = statusCode;
      this.payload = payload;
      this.headers = headers;
      this.contentType = contentType;
      this.contentLength = contentLength;

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

      this.type = 'api';
    }
  }

  athena.nodes.register('api', API);
};
