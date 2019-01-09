'use strict';

module.exports = {
  name: 'test',
  dependencies: 'node',
  load: function(athena) {
    class Test extends athena.nodes.Node {
      constructor(options = {}) {
        super(options);

        const node = this;

        node.config.type = 'test';
        node.config.icon = options.icon || 'progress-wrench';
        node.config.typeIcon = 'progress-wrench';
        node.config.folderIcon = options.folderIcon || 'fire';
        node.config.status = 'own';

        let healths = [];

        node.on('trigger', function() {
          if (!healths.length) {
            healths = Object.keys(athena.constants.health);
          }

          const health = healths.pop();
          const description = `Test health: ${ health }`;

          node.update({
            health,
            description
          });
        });
      }
    }

    athena.nodes.register('test', Test);
  }
};
