'use strict';

module.exports = {
  name: 'folder',
  dependencies: 'http',
  load: function(athena) {
    class FOLDER extends athena.nodes.Node {
      constructor(options) {
        super(options);

        this.config.type = 'folder';
        this.config.icon = 'folder-open';
      }
    }

    athena.nodes.register('folder', FOLDER);
  }
};
