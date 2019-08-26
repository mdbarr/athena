'use strict';

module.exports = {
  name: 'folder',
  dependencies: 'http',
  load (athena) {
    class Folder extends athena.nodes.Node {
      constructor (options = {}) {
        super(options);

        this.config.type = 'folder';

        this.config.icon = options.icon || 'folder-open';
        this.config.typeIcon = 'folder-open';
        this.config.folderIcon = options.folderIcon || 'folder';

        this.config.behavior.status = options.behavior && options.behavior.status ?
          options.behavior.status : 'children';

        this.status.health = athena.constants.health.healthy;
      }
    }

    athena.nodes.register('folder', Folder);
  }
};
