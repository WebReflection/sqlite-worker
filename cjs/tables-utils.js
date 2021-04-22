'use strict';
const tables = (m => /* c8 ignore start */ m.__esModule ? m.default : m /* c8 ignore stop */)(require('sqlite-tables-handler'));

const sqlite3 = ({all, query}) => ({
  all(sql, callback) {
    all([sql]).then($ => callback(null, $), callback);
  },
  run(sql, callback) {
    query([sql]).then(() => callback(), callback);
  }
});

const passThrough = (init, options) => init(options).then(module => (
  options.tables ?
    tables(sqlite3(module), options.tables).then(() => module) :
    module
));
exports.passThrough = passThrough;
