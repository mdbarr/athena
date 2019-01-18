#!/usr/bin/env node
'use strict';

const Athena = require('../server/athena');
const athena = new Athena();

athena.boot();
