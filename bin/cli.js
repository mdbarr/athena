#!/usr/bin/env node
'use strict';

require('barrkeep');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const child_process = require('child_process');

const options = minimist(process.argv.slice(2));

const project = require(path.resolve(__dirname + '/../package.json'));

const athenaCommand = path.resolve(__dirname + '/cli.js');
let athenaProcess;

function spawnAthena() {
  try {
    if (options.lint) {
      console.log('Linting...');
      const output = child_process.execSync(project.scripts['api:lint'] + ' --fix');
      console.log(output.toString());
    }

    const args = options._;
    if (options.config) {
      args.push(`--config=${options.config}`);
    }

    athenaProcess = child_process.spawn(athenaCommand, args, {
      detached: false,
      stdio: 'inherit'
    });
  } catch (error) {
    console.log('Error spawning Athena', error);
  }
}

if (options.help) {
  const name = path.basename(process.argv[1]);
  console.log(`Usage: ${ name } [--help] [--watch] [--config=FILE]`);
  process.exit(0);
} else if (options.watch) {
  const watchDirectory = path.resolve(__dirname + '/../server/');
  let debounce = 0;

  spawnAthena();

  fs.watch(watchDirectory, {
    persistent: true,
    recursive: true
  }, function (eventType, filename) {
    if (!filename.startsWith('.') && filename.endsWith('.js')) {
      if (debounce) {
        clearTimeout(debounce);
      }

      debounce = setTimeout(function () {
        if (athenaProcess) {
          athenaProcess.kill();
        }
        console.log('Reloading Athena...');
        spawnAthena();
      }, 250);
    }
  });
} else {
  let config = {};
  if (options.config) {
    config = JSON.parse(fs.readFileSync(options.config));
  }

  const Athena = require('../server/athena');
  const athena = new Athena(config);
  athena.boot();
}
