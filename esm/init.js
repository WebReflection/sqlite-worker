import SQLiteTag from 'sqlite-tag';
import {assign, dist, load} from './utils.js';

const STORE = 'sqlite';
const keyPath = 'buffer';

const opener = (name, version = 1) => new Promise((resolve, onerror) => {
  assign(indexedDB.open(name, version), {
    onupgradeneeded({target: {result, transaction}}) {
      if (!result.objectStoreNames.contains(STORE))
        result.createObjectStore(STORE)
              .createIndex(keyPath, keyPath, {unique: true});
      assign(transaction, {
        oncomplete() {
          resolve(result);
        }
      });
    },
    onsuccess({target: {result}}) {
      resolve(result);
    },
    onerror
  });
});

export const init = (options = {}) => new Promise((resolve, onerror) => {
  const base = options.dist || dist;
  load(base + '/sql-wasm.js').then(({default: initSqlJs}) => {
    Promise.all([
      opener(options.name || 'sqlite-worker'),
      initSqlJs({
        locateFile: file => base + '/' + file
      })
    ]).then(
        ([iDB, {Database}]) => {
        const store = how => iDB.transaction([STORE], how).objectStore(STORE);
        assign(store('readonly').get(keyPath), {
          onsuccess() {
            let queue = Promise.resolve();
            const {result} = this;
            const db = new Database(result || options.database || new Uint8Array(0));
            const save = () => (queue = queue.then(() => new Promise((resolve, onerror) => {
              const uint8array = db.export();
              assign(store('readwrite').put(uint8array, keyPath).transaction, {
                oncomplete() {
                  resolve();
                  if (options.update)
                    options.update(uint8array);
                },
                onabort: onerror,
                onerror
              });
            })));
            if (!result)
              save();
            const {all, get, query, raw, transaction} = SQLiteTag({
              all(sql, params, callback) {
                try {
                  const rows = db.exec(sql, params);
                  const result = [];
                  rows.forEach(addItems, result);
                  callback(null, result);
                }
                catch (o_O) {
                  callback(o_O);
                }
              },
              get(sql, params, callback) {
                try {
                  const rows = db.exec(sql + ' LIMIT 1', params);
                  const result = [];
                  rows.forEach(addItems, result);
                  callback(null, result.shift() || null);
                }
                catch (o_O) {
                  callback(o_O);
                }
              },
              run(sql, params, callback) {
                try {
                  callback(null, db.run(sql, params));
                }
                catch (o_O) {
                  callback(o_O);
                }
              }
            });
            let t = 0;
            resolve({
              all, get, raw, transaction,
              create_function: (name, func) => db.create_function(name, func),
              close: () => {
                clearTimeout(t);
                return save().then(() => db.close());
              },
              query(template) {
                if (/\b(?:INSERT|DELETE|UPDATE)\b/i.test(template[0])) {
                  clearTimeout(t);
                  t = setTimeout(save, options.timeout || 250);
                }
                return query.apply(this, arguments);
              }
            });
          },
          onerror
        });
      },
      onerror
    );
  });
});

function addItems({columns, values}) {
  for (let {length} = values, i = 0; i < length; i++) {
    const value = values[i];
    const item = {};
    for (let {length} = columns, i = 0; i < length; i++)
      item[columns[i]] = value[i];
    this.push(item);
  }
}
