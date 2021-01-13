'use strict';
(m => {
  exports.init = m.init;
})(require('./init.js'));
(m => {
  exports.SQLiteWorker = m.SQLiteWorker;
})(require('./sqlite-worker.js'));
