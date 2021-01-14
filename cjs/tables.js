'use strict';
(m => {
  exports.init = m.init;
})(require('./tables-init.js'));
(m => {
  exports.SQLiteWorker = m.SQLiteWorker;
})(require('./tables-worker.js'));
