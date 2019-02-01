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

  athena.api.post('/api/session', function(req, res, next) {

    res.send(200);
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
    const renders = {};

    for (const clientId in self.clients) {
      const client = self.clients[clientId];

      if ((client.session.focus === node.config.parent &&
           client.session.mode === athena.constants.mode.focus) ||
          client.session.mode === athena.constants.mode.table ||
          client.session.mode === athena.constants.mode.tree) {

        if (!renders[node.id]) {
          renders[node.id] = node.render();
        }

        const render = renders[node.id];

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
      mode: athena.constants.mode.focus,
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
        message.clientId = clientId;
        message.session = shed.session.sessionId;
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
      console.log('Focusing %s on %s', clientId, message.focus);
      shed.session.mode = athena.constants.mode.focus;
      shed.session.focus = message.focus;

      const focus = athena.store.resolve(shed.session.focus);

      const nodes = athena.store.find({
        parent: shed.session.focus
      });

      shed.session.render = nodes.map(item => item.render());

      const response = {
        type: athena.constants.message.render,
        path: focus.path(),
        nodes: shed.session.render
      };

      shed.message(response);
    });

    shed.on(athena.constants.message.tree, function() {
      console.log('Tree view %s', clientId);
      shed.session.mode = athena.constants.mode.tree;

      const root = athena.store.resolve(athena.constants.nodes.root.id);
      const tree = root.tree();
      tree.name = 'ATHENA';

      shed.session.tree = tree;

      const response = {
        type: athena.constants.message.tree,
        items: [ tree ]
      };

      shed.message(response);
    });

    shed.on(athena.constants.message.table, function() {
      console.log('Table view %s', clientId);
      shed.session.mode = athena.constants.mode.table;

      const root = athena.store.resolve(athena.constants.nodes.root.id);
      const table = root.table();

      shed.session.table = table;

      const response = {
        type: athena.constants.message.table,
        items: table
      };

      shed.message(response);
    });

    shed.on(athena.constants.message.action, function(message) {
      console.log('Invoking %s on %s via %s', message.action, message.node, clientId);

      const node = athena.store.resolve(message.node);
      if (node && node.actions[message.action]) {
        const action = node.actions[message.action];
        if (action.available()) {
          action.call();
        }
      }
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

  athena.api.get('/*', restify.plugins.serveStatic({
    directory: './dist',
    default: 'index.html'
  }));

  athena.api.get('/css/*', restify.plugins.serveStatic({
    directory: './dist/css',
    appendRequestPath: false
  }));

  athena.api.get('/fonts/*', restify.plugins.serveStatic({
    directory: './dist/fonts',
    appendRequestPath: false
  }));

  athena.api.get('/img/*', restify.plugins.serveStatic({
    directory: './dist/img',
    appendRequestPath: false
  }));

  athena.api.get('/js/*', restify.plugins.serveStatic({
    directory: './dist/js',
    appendRequestPath: false
  }));

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
