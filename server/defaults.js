'use strict';

const path = require('path');
const uuid = require('uuid/v4');
const crypto = require('crypto');

const identity = uuid();

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
    passphrase: identity
  }
});

module.exports = {
  object: 'config',
  athena: {
    identity,
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
