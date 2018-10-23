'use strict';

function Models(athena) {
  const self = this;

  //////////

  self.session = function({
    id, user
  }) {
    const model = {
      id: id || athena.util.id,
      user
    };

    return model;
  };

  //////////

  return self;
}

module.exports = function(athena) {
  return new Models(athena);
};
