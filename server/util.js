'use strict';

const uuid = require('uuid/v4');

function Util(athena) {
  this.id = () => uuid();
}

module.exports = function(athena) {
  return new Util();
};
