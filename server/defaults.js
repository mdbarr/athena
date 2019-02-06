'use strict';

const path = require('path');
const util = require('./util');
const crypto = require('crypto');

const keys = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: util.generateLocalPassword()
  }
});

module.exports = {
  object: 'config',
  athena: {
    identity: util.id(),
    publicKey: keys.publicKey,
    privateKey: keys.privateKey
  },
  api: {
    enabled: true,
    host: '0.0.0.0',
    port: 6250,
    available: true
  },
  log: {
    enabled: false,
    console: false,
    file: path.join(__dirname, 'athena.log')
  }
};
