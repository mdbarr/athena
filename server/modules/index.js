'use strict';

module.exports = function(athena) {
  const index = require('requireindex')(__dirname);

  for (const key of index) {
    if (typeof index[key] === 'function') {
      index[key] = index[key](athena);
    }
  }

  return index;
};
