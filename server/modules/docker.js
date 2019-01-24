'use strict';

const os = require('os');
const Dockerode = require('dockerode');

const totalMemory = os.totalmem();

module.exports = [ {
  name: 'container',
  dependencies: 'docker',
  load: function(athena) {
    class Container extends athena.nodes.Node {
      constructor(options = {}) {
        super(options);

        const node = this;

        node.config.type = 'container';
        node.config.icon = options.icon || 'container';
        node.config.typeIcon = 'container';

        node.status.health = athena.constants.health.healthy;

        node.docker = options.docker;
        node.container = options.container;

        node.on('trigger', function() {
          node.docker.getContainer(node.id).stats({
            stream: false
          }, function(error, stats) {

            const state = node.container.State;
            let health = athena.constants.health.healthy;

            let image = node.container.Image;
            if (image.startsWith('sha256:')) {
              image = image.replace('sha256:', '').substring(0, 12);
            }

            // created, restarting, running, paused, exited, dead
            if (state === 'exited') {
              health = athena.constants.health.failed;
            } else if (state === 'paused') {
              health = athena.constants.health.unknown;
            }

            let metric = 0;
            let description = `<i class="mdi mdi-image-area"></i> ${ image } (${ state })`;

            if (!error && stats && state === 'running') {
              const cpuDelta = stats.cpu_stats.cpu_usage.total_usage -
                    stats.precpu_stats.cpu_usage.total_usage;
              const systemDelta = stats.cpu_stats.system_cpu_usage -
                    stats.precpu_stats.system_cpu_usage;
              const cpu = athena.util.precisionRound(cpuDelta / systemDelta, 4);

              const memory = athena.util.precisionRound(stats.memory_stats.usage / totalMemory, 4);
              description += ` - CPU: ${ Math.round(cpu * 100) }% Memory: ${ Math.round(memory * 100) }%`;
              metric = cpu;
            }

            if (node.container.Ports.length) {
              description += '<br>Ports: ' + node.container.Ports.map(function(item) {
                return `${ item.PublicPort } <i class="mdi mdi-arrow-right"></i> ${ item.PrivatePort }/${ item.Type }`;
              }).join(', ');
            }

            node.update({
              health,
              state,
              description,
              metric
            });
          });
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
        node.config.icon = options.icon || 'docker';
        node.config.typeIcon = 'docker';

        node.config.behavior.status = 'own';
        node.config.behavior.trigger = 'self';

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
                  node.containers[item.Id].container = item;
                  continue;
                }

                const object = {
                  id: item.Id,
                  name: item.Names[0].replace(/^\//, ''),
                  type: 'container',
                  parent: node.id,
                  docker: node.docker,
                  container: item,
                  ephemeral: true,
                  behavior: {
                    status: 'own',
                    trigger: 'self',
                    sync: false
                  },
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

              // Remove stale containers

              // Trigger remaining containers
              for (const container in node.containers) {
                node.containers[container].trigger();
              }

              const description = `<i class="mdi mdi-progress-check"></i> Running containers: ${ info.ContainersRunning }<br><i class="mdi mdi-folder-image"></i> Images: ${ info.Images }`;
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
