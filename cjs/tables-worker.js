'use strict';
const {passThrough} = require('./tables-utils.js');

const {SQLiteWorker: $SQLiteWorker} = require('./sqlite-worker.js');

function SQLiteWorker(options = {}) {
  return passThrough($SQLiteWorker, options);
}
exports.SQLiteWorker = SQLiteWorker;
