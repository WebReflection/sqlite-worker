'use strict';
const {load} = require('./utils.js');

let db = null;

const retrieve = (db, method, id, {template, values}) => {
  db.then((module) => {
    module[method].apply(null, [template].concat(values)).then(
      result => {
        postMessage({id, result});
      },
      ({message: error}) => {
        postMessage({id, error});
      }
    );
  });
};

addEventListener('message', ({data: {id, action, options}}) => {
  if (action === 'init') {
    if (!db)
      db = load(options.library).then(({init}) => init(options));
    db.then(
      () => postMessage({id, result: 'OK'}),
      ({message: error}) => postMessage({id, error})
    );
  }
  // all, get, query do the same
  else
    retrieve(db, action, id, options);
});
