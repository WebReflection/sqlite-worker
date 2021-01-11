'use strict';
const {assign} = Object;

const cache = new Map;

let ids = 0;

(m => {
  exports.init = m.init;
})(require('./init.js'));

function SQLiteWorker(path, options) {
  const query = how => (template, ...values) => post(how, {template, values});
  const post = (action, options) => new Promise((resolve, reject) => {
    const id = ids++;
    cache.set(id, {resolve, reject});
    worker.postMessage({id, action, options});
  });
  const worker = assign(new Worker(path), {
    onmessage({data: {id, result, error}}) {
      const {resolve, reject} = cache.get(id);
      cache.delete(id);
      if (error)
        reject(error);
      else
        resolve(result);
    }
  });
  const library = __filename;
  return post('init', assign({library}, options)).then(() => ({
    all: query('all'),
    get: query('get'),
    query: query('query')
  }));
}
exports.SQLiteWorker = SQLiteWorker;
