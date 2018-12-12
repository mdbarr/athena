#!/usr/bin/env node

const Athena = require('./server/athena');

const athena = new Athena();

athena.boot();
