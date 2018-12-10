'use strict';

module.exports = {
  name: 'api',
  dependencies: 'http',
  load: function(athena) {
    class API extends athena.nodes.HTTP {
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
  }
};
