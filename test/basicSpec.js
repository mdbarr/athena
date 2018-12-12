'use strict';

const Athena = require('../server/athena');

describe('Basic Spec', function() {
  let athena;
  let root;
  let server;

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
    console.pp(root.serialize());
  });

  it('should create a server node', function() {
    server = athena.nodes.create({
      name: 'localhost',
      id: '12fbf70a-fcc7-11e8-a2a8-32001b294000',
      parent: root.id,
      type: 'server',
      sync: false,
      address: '127.0.0.1'
    });
    console.pp(server.serialize());
  });

  it('should add server as a child of root', function() {
    root.addChild(server);
    console.pp(root.serialize());
  });

  it('should stop the athena instance', function(done) {
    athena.stop(done);
  });
});
