'use strict';

const Dockerode = require('dockerode');

module.exports = [ {
  name: 'container',
  dependencies: 'docker',
  load: function(athena) {
    class Container extends athena.nodes.Node {
      constructor(options = {}) {
        super(options);

        const node = this;

        node.config.type = 'container';
        node.config.icon = 'container';

        node.status.health = athena.constants.health.healthy;

        node.docker = options.docker;

        node.on('trigger', function() {
          // trigger
        });
      }
    };

    athena.nodes.register('container', Container);
  }
}, {
  name: 'docker',
  dependencies: 'node',
  load: function(athena) {
    class Docker extends athena.nodes.Node {
      constructor(options = {}) {
        super(options);

        const node = this;
        const dockerOptions = {};

        if (options.socket) {
          dockerOptions.sockerPath = options.socket;
        } else if (options.host) {
          dockerOptions.host = options.host;
          dockerOptions.port = Number(options.port || 2375);
        } else {
          options.socketPath = '/var/run/docker.sock';
        }

        node.config.type = 'docker';
        node.config.icon = 'docker';

        node.status.health = athena.constants.health.healthy;

        node.docker = new Dockerode(dockerOptions);
        node.containers = {};

        node.on('trigger', function() {
          node.docker.info(function(error, info) {
            node.docker.listContainers({
              all: true
            }, function(error, containers) {
              for (const item of containers) {
                if (node.containers[item.Id]) {
                  continue;
                }

                const object = {
                  id: item.Id,
                  name: item.Names[0].replace(/^\//, ''),
                  type: 'container',
                  parent: node.id,
                  docker: node.docker,
                  sync: false,
                  ephemeral: true,
                  metadata: {
                    image: item.Image,
                    created: item.Created,
                    state: item.State,
                    status: item.Status,
                    ports: item.Ports
                  }
                };
                const container = athena.nodes.create(object);
                node.containers[item.Id] = container;

                container.link();
                container.enable();
                container.activate();
              }

              const description = `<i class="mdi mdi-package"></i> Running containers: ${ info.ContainersRunning }`;
              node.update({
                health: athena.constants.health.healthy,
                description,
                metric: info.ContainersRunning
              });
            });
          });
        });

        node.emit('trigger');
      }
    }

    athena.nodes.register('docker', Docker);
  }
} ];
