import {load} from './utils.js';

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
  // action === `all` || `get` || `query`
  else {
    const {template, values} = options;
    db.then((module) => {
      module[action].apply(null, [template].concat(values)).then(
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
