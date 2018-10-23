'use strict';

const Athena = require('../server/athena');

describe('Basic Spec', function() {
  let athena;
  let root;

  it('should create and boot an Athena instance', function(done) {
    athena = new Athena();

    athena.boot(done);
  });

  it('should create the root node', function(done) {
    root = athena.nodes.create({
      name: 'root',
      id: '1599655d-e358-4c6e-a5da-8b6058b2e435',
      parent: null,
      sync: false
    });
    console.pp(root.serialize());
    done();
  });

  it('should stop the athena instance', function(done) {
    athena.stop(done);
  });
});
