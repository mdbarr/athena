'use strict';

module.exports = {
  name: 'folder',
  dependencies: 'http',
  load: function(athena) {
    class Folder extends athena.nodes.Node {
      constructor(options) {
        super(options);

        this.config.type = 'folder';
        this.config.icon = 'folder-open';
        this.config.status = 'children';
      }
    }

    athena.nodes.register('folder', Folder);
  }
};
