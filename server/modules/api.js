'use strict';

module.exports = {
  name: 'api',
  dependencies: 'http',
  load: function(athena) {
    class API extends athena.nodes.HTTP {
      constructor(options = {}) {
        super(options);

        this.config.type = 'api';
      }
    }

    athena.nodes.register('api', API);
  }
};
