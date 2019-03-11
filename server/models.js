'use strict';

function Models(athena) {
  const self = this;

  //////////

  self.user = function({
    id, name, email, username, password,
    isAdmin = false, isSecure = false,
    requiresPasswordChange = false
  }) {
    const model = {
      id: id || athena.util.id(),
      name,
      email,
      username: username ? username : name.toLowerCase(),
      password,
      // flags
      isAdmin: Boolean(isAdmin),
      isSecure: Boolean(isSecure),
      requiresPasswordChange: Boolean(requiresPasswordChange)
    };

    if (!model.isSecure) {
      model.password = athena.util.sha256(model.password);
      model.isSecure = true;
      // sync?
    }

    return model;
  };

  self.session = function({ user = {} }) {
    const model = {
      id: athena.util.id(),
      timestamp: athena.util.timestamp(),
      ttl: -1,
      name: user.name,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin
    };

    return model;
  };

  //////////

  return self;
}

module.exports = function(athena) {
  return new Models(athena);
};
