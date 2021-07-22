import {asStatic, asParams} from 'static-params';
import {assign, dist} from './utils.js';

const cache = new Map;

const raw = (tpl, ...values) => asStatic(plain(tpl, ...values));

const workerURL = url => URL.createObjectURL(
  new Blob([`importScripts('${url}')`], {type: 'text/javascript'})
);

let ids = 0;

export function SQLiteWorker(options = {}) {
  const {credentials} = options;
  const base = options.dist || dist;
  const url = options.worker || (base + '/worker.js');
  const query = how => (template, ...values) => {
    const [sql, ...params] = asParams(template, ...values);
    return post(how, {template: sql, values: params});
  };
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
    assign({dist: base, library: base + '/init.js'}, options)
  ).then(() => ({
    all: query('all'),
    get: query('get'),
    query: query('query'),
    raw
  }));
};
