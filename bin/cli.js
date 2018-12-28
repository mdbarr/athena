#!/usr/bin/env node
'use strict';

require('barrkeep');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const watch = require('glob-watcher');
const child_process = require('child_process');

const options = minimist(process.argv.slice(2));

const debounceTimeout = parseInt(options.debounce || 250);

const baseDirectory = path.resolve(__dirname + '/../');
const athenaCommand = path.resolve(__dirname + '/cli.js');
const project = require(path.resolve(__dirname + '/../package.json'));

let paused = false;
const ready = 0;
let athenaProcess;

function launchAthena() {
  setTimeout(function() {
    paused = false;
  }, 5000);

  try {
    if (options.lint) {
      console.log('Linting...');
      child_process.execSync(project.scripts['api:lint'] + ' --fix', {
        stdio: 'inherit'
      });
    }

    if (athenaProcess) {
      console.log('Reloading Athena...');
    } else {
      console.log('Launching Athena...');
    }

    const args = options._;
    if (options.config) {
      args.push(`--config=${ options.config }`);
    }

    athenaProcess = child_process.fork(athenaCommand, args, {
      detached: false,
      stdio: 'inherit'
    });

    athenaProcess.on('message', function() {
      clearTimeout(ready);
      paused = false;
    });

  } catch (error) {
    console.log('Error launching Athena:\n  ', error.message);
    paused = false;
    athenaProcess = null;
  }
}

if (options.help) {
  const name = path.basename(process.argv[1]);
  console.log(`Usage: ${ name } [--help] [--watch] [--config=FILE]`);
  process.exit(0);
} else if (options.watch) {
  let debounce = 0;

  launchAthena();

  const handler = function (filepath) {
    const filename = path.basename(filepath);

    if (!paused && !filename.startsWith('.') && filename.endsWith('.js')) {
      if (debounce) {
        clearTimeout(debounce);
      }

      debounce = setTimeout(function () {
        paused = true;

        if (athenaProcess) {
          athenaProcess.on('exit', function() {
            launchAthena();
          });

          athenaProcess.kill();
        } else {
          launchAthena();
        }
      }, debounceTimeout);
    }
  };

  const watcher = watch([ baseDirectory + '/server/**/*.js',
    baseDirectory + '/common/**/*.js',
    baseDirectory + '/bin/**/*.js' ]);

  watcher.on('add', handler);
  watcher.on('change', handler);
} else {
  process.title = 'athena';

  let config = {};
  if (options.config) {
    config = JSON.parse(fs.readFileSync(options.config));
  }

  const Athena = require('../server/athena');
  const athena = new Athena(config);

  athena.boot(function() {
    if (process.send) {
      process.send('ready');
    }
  });
}
