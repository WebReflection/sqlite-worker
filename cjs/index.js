'use strict';
const {assign, dist} = require('./utils.js');

const cache = new Map;

const workerURL = url => URL.createObjectURL(
  new Blob([`importScripts('${url}')`], {type: 'text/javascript'})
);

let ids = 0;

(m => {
  exports.init = m.init;
})(require('./init.js'));

function SQLiteWorker(options) {
  const {credentials} = options;
  const base = options.dist || dist;
  const url = options.worker || (base + '/worker.js');
  const query = how => (template, ...values) => post(how, {template, values});
  const post = (action, options) => new Promise((resolve, reject) => {
    const id = ids++;
    cache.set(id, {resolve, reject});
    worker.postMessage({id, action, options});
  });
  const worker = assign(new Worker(
    /^(?:\.|\/)/.test(url) ? url : workerURL(url),
    {credentials}
  ), {
    onmessage({data: {id, result, error}}) {
      const {resolve, reject} = cache.get(id);
      cache.delete(id);
      if (error)
        reject(error);
      else
        resolve(result);
    }
  });
  return post(
    'init',
    assign(
      {library: base + '/init.js'},
      assign({dist: base}, options)
    )
  ).then(() => ({
    all: query('all'),
    get: query('get'),
    query: query('query')
  }));
}
exports.SQLiteWorker = SQLiteWorker;
