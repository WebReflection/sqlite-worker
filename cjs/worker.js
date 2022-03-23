'use strict';
const {load} = require('./utils.js');

let db = null;

addEventListener('message', ({data: {id, action, options}}) => {
  if (action === 'init') {
    if (!db)
      db = load(options.library).then(({init}) => init(options));
    db.then(
      () => postMessage({id, result: 'OK'}),
      ({message: error}) => postMessage({id, error})
    );
  }
  else if (action === 'close') {
    db.then(module => module.close().then(
      () => {
        postMessage({id});
      },
      ({message: error}) => {
        postMessage({id, error});
      }
    ));
  }
  else if (action === 'create_function') {
    db.then(module => {
      try {
        const [name, func] = options;
        const result = module[action](name, Function('return ' + func)());
        postMessage({id, result});
      }
      catch({message: error}) {
        postMessage({id, error});
      }
    });
  }
  // action === `all` || `get` || `query`
  else {
    const {template, values} = options;
    db.then((module) => {
      module[action](template, ...values).then(
        result => {
          postMessage({id, result});
        },
        ({message: error}) => {
          postMessage({id, error});
        }
      );
    });
  }
});
