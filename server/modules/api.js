'use strict';

module.exports = {
  name: 'api',
  dependencies: 'http',
  load: function(athena) {
    class API extends athena.nodes.HTTP {
      constructor(options = {}) {
        super(options);

        this.config.type = 'api';
        this.config.typeIcon = 'web';
      }
    }

    athena.nodes.register('api', API);
  }
};
