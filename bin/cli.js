#!/usr/bin/env node
'use strict';

require('barrkeep');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const watch = require('glob-watcher');
const child_process = require('child_process');
const bootstrap = require('./bootstrap');

const options = minimist(process.argv.slice(2));

if (options.bootstrap) {
  bootstrap(options);
} else if (options.createConfig || options['create-config']) {
  const config = require(path.resolve(__dirname + '/../server/defaults'));
  const data = {
    users: [],
    nodes: [],
    config
  };
  console.log(JSON.stringify(data, null, 2));
} else {
  const baseDirectory = path.resolve(__dirname + '/../');
  const athenaCommand = path.resolve(__dirname + '/cli.js');
  const project = require(path.resolve(__dirname + '/../package.json'));

  let paused = false;
  let athenaProcess;
  let crashTimeout = 0;

  function launchAthena() {
    clearTimeout(crashTimeout);

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
        paused = false;
      });

      athenaProcess.on('exit', function(code) {
        athenaProcess = null;

        if (code !== 0) {
          console.log('Athena crashed, relaunching in 10s...');
          paused = false;
          crashTimeout = setTimeout(function() {
            launchAthena();
          }, 10000);
        }
      });

    } catch (error) {
      console.log('Error launching Athena:\n  ', error.message);
      paused = false;
      athenaProcess = null;
    }
  }

  if (options.help) {
    const name = path.basename(process.argv[1]);
    console.log(`Athena CLI - Usage:\n${ name } [--help] [--watch] [--config=FILE] [--bootstap] [--file=FILE] [--drop]`);
    process.exit(0);
  } else if (options.watch) {
    launchAthena();

    const handler = function (filepath) {
      const filename = path.basename(filepath);

      if (!paused && !filename.startsWith('.') && filename.endsWith('.js')) {
        paused = true;

        if (athenaProcess) {
          athenaProcess.on('exit', function() {
            launchAthena();
          });

          athenaProcess.kill('SIGINT');
        } else {
          launchAthena();
        }
      }
    };

    const watcher = watch([
      baseDirectory + '/server/**/*.js',
      baseDirectory + '/common/**/*.js',
      baseDirectory + '/bin/**/*.js',
      baseDirectory + '/package.json',
      baseDirectory + '/yarn.lock'
    ]);

    watcher.on('add', handler);
    watcher.on('change', handler);
  } else {
    process.title = 'athena';
    process.on('SIGINT', () => process.exit(0));

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
}
