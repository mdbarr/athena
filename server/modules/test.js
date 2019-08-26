'use strict';

module.exports = {
  name: 'test',
  dependencies: 'node',
  load (athena) {
    class Test extends athena.nodes.Node {
      constructor (options = {}) {
        super(options);

        const node = this;

        node.config.type = 'test';
        node.config.icon = options.icon || 'progress-wrench';
        node.config.typeIcon = 'progress-wrench';
        node.config.folderIcon = options.folderIcon || 'fire';
        node.config.behavior.status = options.behavior && options.behavior.status ?
          options.behavior.status : 'own';

        let healths = [];

        node.on('trigger', () => {
          if (!healths.length) {
            healths = Object.keys(athena.constants.health);
          }

          const health = healths.pop();

          let description = `Test health: ${ health }`;
          if (node.status.children.length) {
            for (let i = 0; i < node.status.children.length; i++) {
              description += `<br> Child #${ i + 1 }: ${ node.status.children[i] }`;
            }
          }

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
