'use strict';

const Athena = require('../server/athena');

describe('Basic Spec', function() {
  let athena;
  let root;
  let ping;

  it('should create and boot an Athena instance', function(done) {
    athena = new Athena();

    athena.boot(done);
  });

  it('should create the root node', function() {
    root = athena.nodes.create({
      name: 'root',
      id: 'root',
      parent: null,
      sync: false,
      ephemeral: true
    });
  });

  it('should create a ping node', function() {
    ping = athena.nodes.create({
      name: 'localhost',
      id: '12fbf70a-fcc7-11e8-a2a8-32001b294000',
      parent: root.id,
      type: 'ping',
      sync: false,
      address: '127.0.0.1',
      triggers: [
        //'cron: * * * * *'
      ]
    });
  });

  it('should add ping as a child of root', function() {
    root.addChild(ping);
  });

  it('should enable the root and ping nodes', function() {
    root.actions.enable();
    ping.actions.enable();
  });

  it('should manually trigger the ping node', function() {
    ping.actions.trigger();
  });

  it('should verify the ping is now healthy', function() {
    ping.status.health.should.equal(athena.constants.health.healthy);
  });

  it('should activate the ping triggers', function() {
    athena.triggers.activate(ping);
  });

  it('should stop the athena instance', function(done) {
    athena.stop(done);
  });
});
