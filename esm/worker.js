let db = null;

const retrieve = (db, method, id, {template, values}) => {
  db.then((module) => {
    module[method].apply(null, [template].concat(values)).then(result => {
      postMessage({id, result});
    });
  });
};

addEventListener('message', ({data: {id, action, options}}) => {
  switch (action) {
    case 'init':
      if (!db) {
        const lib = options && options.library ||
                    'https://unpkg.com/sqlite-worker?module';
        db = import(lib).then(({init}) => init(options));
      }
      return db.then(() => postMessage({id, result: 'OK'}));
    case 'all':
      return retrieve(db, 'all', id, options);
    case 'get':
      return retrieve(db, 'get', id, options);
    case 'query':
      return retrieve(db, 'query', id, options);
  }
});
