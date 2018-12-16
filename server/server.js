'use strict';

const restify = require('restify');
const Watershed = require('watershed').Watershed;

const PING_INTERVAL = 5000;

function Server(athena) {
  const self = this;

  self.clients = {};

  //////////

  athena.api = restify.createServer({
    name: 'Athena',
    ignoreTrailingSlash: true,
    strictNext: true,
    handleUpgrades: true
  });

  athena.api.ws = new Watershed();

  athena.api.use(restify.pre.sanitizePath());
  athena.api.pre(restify.plugins.pre.dedupeSlashes());
  athena.api.use(restify.plugins.dateParser());
  athena.api.use(restify.plugins.queryParser());
  athena.api.use(restify.plugins.bodyParser());
  athena.api.use(restify.plugins.authorizationParser());

  athena.api.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization');

    res.header('athena-server-version', athena.version);

    next();
  });

  //////////

  athena.api.get('/api/version', function(req, res, next) {
    const version = {
      name: 'athena-server',
      version: athena.version
    };
    res.send(200, version);
    next();
  });

  /////////

  self.pingInterval = setInterval(function() {
    for (const client in self.clients) {
      try {
        self.clients[client].message('PING');
      } catch (error) {
        delete self.clients[client];
      }
    }
  }, PING_INTERVAL);

  athena.api.get('/ws/attach', function(req, res, next) {
    if (!res.claimUpgrade) {
      next(new Error('Connection Must Upgrade For WebSockets'));
      return;
    }

    const upgrade = res.claimUpgrade();
    const shed = athena.api.ws.accept(req, upgrade.socket, upgrade.head);

    const clientId = athena.util.id();

    self.clients[clientId] = shed;

    console.log('CLIENT CONNECT', clientId);

    shed.on('connectionReset', function() {
      console.log('CLIENT RESET', clientId);
      delete self.clients[clientId];
    });

    shed.on('text', function(msg) {
      if (msg === 'PONG') {
        console.log('Received PONG from websocket client', clientId);
        return;
      }
      try {
        const message = JSON.parse(msg);
        console.pp(message);
      } catch (error) {
        console.log('ERROR: parsing client message', msg, error);
      }
    });

    shed.on('end', function() {
      console.log('CLIENT DISCONNECT', clientId);
      delete self.clients[clientId];
    });

    shed.message = function(message) {
      if (typeof message === 'string') {
        shed.send(message);
      } else {
        message.version = athena.version;
        message = JSON.stringify(message);
        shed.send(message);
      }
    };

    shed.message({
      type: 'connected',
      clientId
    });
  });

  //////////

  self.boot = function(callback) {
    callback = athena.util.callback(callback);
    athena.api.listen(athena.config.api.port, athena.config.api.host, function(error) {
      if (error) {
        return callback(error);
      } else {
        console.log(`Athena Server running on http://${ athena.config.api.host}:${ athena.config.api.port }`);
        callback();
      }
    });
  };

  self.stop = function(callback) {
    callback = athena.util.callback(callback);

    clearInterval(self.pingInterval);

    athena.api.close(callback);
  };

  return this;
}

module.exports = function(athena) {
  return new Server(athena);
};
