'use strict';
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
  switch (action) {
    case 'init':
      console.log(options.library);
      if (!db)
        db = import(options.library).then(({init}) => init(options));
      return db.then(
        () => postMessage({id, result: 'OK'}),
        ({message: error}) => postMessage({id, error})
      );
    case 'all':
      return retrieve(db, 'all', id, options);
    case 'get':
      return retrieve(db, 'get', id, options);
    case 'query':
      return retrieve(db, 'query', id, options);
  }
});
