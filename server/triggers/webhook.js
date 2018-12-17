'use strict';

function Webhook(athena, node, options, id) {
  const url = `/api/triggers/${ node.id }`;

  const trigger(req, res, next) {
    node.trigger(id);

    res.send(200);
    next();
  }

  athena.api.post(url, trigger);
  athena.api.put(url, trigger);
}

module.exports = Webhook;
