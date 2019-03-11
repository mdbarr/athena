'use strict';

const Athena = require('../server/athena');

describe('Basic Spec', () => {
  let athena;
  let root;
  let ping;

  it('should create and boot an Athena instance', (done) => {
    athena = new Athena();

    athena.boot(done);
  });

  it('should create the root node', () => {
    root = athena.nodes.create({
      name: 'root',
      id: 'root',
      parent: null,
      sync: false,
      ephemeral: true
    });
  });

  it('should create a ping node', () => {
    ping = athena.nodes.create({
      name: 'localhost',
      id: '12fbf70a-fcc7-11e8-a2a8-32001b294000',
      parent: root.id,
      type: 'ping',
      sync: false,
      address: '127.0.0.1',
      triggers: [
        'cron: * * * * *'
      ]
    });
  });

  it('should add ping as a child of root', () => {
    root.addChild(ping);
  });

  it('should enable the root and ping nodes', () => {
    root.actions.enable();
    ping.actions.enable();
  });

  it('should manually trigger the ping node', () => {
    ping.actions.trigger();
  });

  it('should verify the ping is now healthy', () => {
    ping.status.health.should.equal(athena.constants.health.healthy);
  });

  it('should activate the ping triggers', () => {
    athena.triggers.activate(ping);
  });

  it('should stop the athena instance', (done) => {
    athena.stop(done);
  });
});
