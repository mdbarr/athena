'use strict';

const restify = require('restify');
const findFreePort = require('find-free-port');
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
    for (const clientId in self.clients) {
      try {
        self.clients[clientId].message(athena.constants.message.ping);
      } catch (error) {
        delete self.clients[clientId];
      }
    }
  }, PING_INTERVAL);

  self.clientUpdate = function(node) {
    for (const clientId in self.clients) {
      const client = self.clients[clientId];

      if (client.session.focus === node.config.parent) {
        const render = node.render();

        const update = {
          type: athena.constants.message.update,
          node: render
        };

        client.message(update);
      }
    }
  };

  athena.api.get('/ws/attach', function(req, res, next) {
    if (!res.claimUpgrade) {
      next(new Error('Connection Must Upgrade For WebSockets'));
      return;
    }

    const upgrade = res.claimUpgrade();
    const shed = athena.api.ws.accept(req, upgrade.socket, upgrade.head);

    const clientId = athena.util.id();

    shed.session = {
      clientId,
      sessionId: null,
      focus: null
    };

    self.clients[clientId] = shed;

    console.log('CLIENT CONNECT', clientId);

    shed.on('connectionReset', function() {
      console.log('CLIENT RESET', clientId);
      delete self.clients[clientId];
    });

    shed.on('text', function(msg) {
      if (msg === athena.constants.message.pong) {
        // console.log('Received PONG from websocket client', clientId);
        return;
      }
      try {
        const message = JSON.parse(msg);
        console.pp(message);
        shed.emit(message.type, message);
      } catch (error) {
        console.log('ERROR: parsing client message', msg, error);
      }
    });

    shed.on('end', function() {
      console.log('CLIENT DISCONNECT', clientId);
      delete self.clients[clientId];
    });

    shed.on(athena.constants.message.focus, function(message) {
      console.log('Focusing %s on %s', clientId, message.path);
      shed.session.focus = message.path;

      shed.session.render = athena.store.find({
        parent: shed.session.focus
      }).
        map(item => item.render());

      const response = {
        type: athena.constants.message.render,
        nodes: shed.session.render
      };

      shed.message(response);
    });

    //////////

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

  self.findPort = function(callback) {
    if (athena.config.api.available) {
      findFreePort(athena.config.api.port, callback);
    } else {
      callback(null, athena.config.api.port);
    }
  };

  self.boot = function(callback) {
    callback = athena.util.callback(callback);

    if (!athena.config.api.enabled) {
      return callback();
    }

    self.findPort(function(error, port) {
      if (error) {
        console.log('Error finding free port');
        return callback(error);
      }

      athena.events.on('status', self.clientUpdate);

      athena.api.listen(port, athena.config.api.host, function(error) {
        if (error) {
          return callback(error);
        } else {
          console.log(athena.constants.assets.owlPrompt,
            `Athena Server running on http://${ athena.config.api.host}:${ port }`);
          callback();
        }
      });
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
