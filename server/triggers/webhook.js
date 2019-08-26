'use strict';

const defaultMethod = 'post';
const methods = [
  'del',
  'get',
  'head',
  'options',
  'patch',
  'post',
  'put'
];

function Webhook (athena, node, options, id) {
  const url = `/api/triggers/${ node.id }`;

  options = options.split(/,\s*/);
  if (!options.length) {
    options.push(defaultMethod);
  }

  const trigger = function(req, res, next) {
    node.trigger(id);

    res.send(200);
    next();
  };

  if (!Array.isArray(node.metadata.webhooks)) {
    node.metadata.webhooks = [];
  }

  const routes = [];

  for (let method in options) {
    method = method.atrim();
    if (methods.includes(method)) {
      routes.push(athena.api[method](url, trigger));
      node.metadata.webhooks.push(`${ method } ${ url }`);
    } else {
      console.log('Unknown HTTP method for webhook trigger', method);
    }
  }

  this.stop = function() {
    for (const route of routes) {
      athena.api.rm(route);
    }
  };
}

module.exports = Webhook;
