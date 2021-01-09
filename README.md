# sqlite-worker

<sup>**Social Media Photo by [benjamin lehman](https://unsplash.com/@benjaminlehman) on [Unsplash](https://unsplash.com/)**</sup>

A simple, and persistent, SQLite database for Web and Workers, based on [sql.js](https://github.com/sql-js/sql.js#readme) and [sqlite-tag](https://github.com/WebReflection/sqlite-tag#readme).


#### ℹ Very Important

This module is currently using the debugging version of `sql.js`, for the simple reason I had out of memory issues trying to load the production version as module.

I don't know if once that gets fixed the previous db would be compatible, so please feel free to use and test this module, but be aware it might change soon with a faster, likely smaller, *WASM* version of sqlite3.



### Initialization Options

Both `init([options])` and `SQLiteWorker(path[, options])` optionally accept a configuration/options object with the following fields:

  * **name**: the persistent database name. By default it's the *string* `'sqlite-worker'`
  * **dir**: where to find `sql.js` files.  By default it's the *string* `'https://sql.js.org/dist'`
  * **database**: an initial SQLite database, as `Uint8Array` instance. This is used only the very first time, and it fallbacks to `new Uint8Array(0)`.
  * **timeout**: minimum interval, in milliseconds, between saves, to make storing, and exporting, the database, less greedy. By default it's the *number* `250`.

#### Worker Extra Options

  * **library**: where to find the `sqlite-worker` library. By default is the *string* `https://unpkg.com/sqlite-worker?module`


#### Direct init Extra Options

  * **update**: a *function* that receives latest version of the database, as `Uint8Array`, whenever some query executed an `INSERT`, a `DELETE`, or an `UPDATE`.




### Module exports

Both `init(...)` and `SQLiteWorker(...)` resolves with the [sqlite-tag API](https://github.com/WebReflection/sqlite-tag#api), except for the `raw` utility, which is not implemented via the *Worker* interface, but it's exported within the `init(...)`, as it requires a special instance that won't survive `postMessage` dance.

The API in a nutshell is:

  * **all**: a template literal tag to retrieve all rows that match the query
  * **get**: a template literal tag to retrieve one row that matches the query
  * **query**: a template literal tag to simply query the database (no result returned)

All tags are *asynchronous*, so that it's possible to *await* their result.



### Worker usage

This is the suggested way to use this module. The Worker can be as simple as this:

```js
// simple-worker.js
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
```

And the library can be initialized as such:

```js
import {SQLiteWorker} from 'sqlite-worker';

// SQLiteWorker(workerPath[, options])
SQLiteWorker('simple-worker.js', {
  name: 'my-db',
  library: '//unpkg.com/sqlite-worker?module'
})
  .then(async ({all, get, query}) => {
    await query`CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, value TEXT)`;
    const {total} = await get`SELECT COUNT(id) as total FROM todos`;
    if (total < 1) {
      console.log('Inserting some value');
      await query`INSERT INTO todos (value) VALUES (${'a'})`;
      await query`INSERT INTO todos (value) VALUES (${'b'})`;
      await query`INSERT INTO todos (value) VALUES (${'c'})`;
    }
    console.log(await all`SELECT * FROM todos`);
  });
```



### Direct usage

This module can be used in the main thread, or be imported directly within a *Service Worker*, as opposite of creating a new worker from the main page.

```js
import {init} from 'sqlite-worker';

// init([options])
init({name: 'my-db'}).then(async ({all, get, query}) => {
  await query`CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, value TEXT)`;
  const {total} = await get`SELECT COUNT(id) as total FROM todos`;
  if (total < 1) {
    console.log('Inserting some value');
    await query`INSERT INTO todos (value) VALUES (${'a'})`;
    await query`INSERT INTO todos (value) VALUES (${'b'})`;
    await query`INSERT INTO todos (value) VALUES (${'c'})`;
  }
  console.log(await all`SELECT * FROM todos`);
});
```

## Compatibility

This module requires a browser compatible with *WASM* and dynamic `import(...)`. This module won't work in old Edge or IE, as these don't even know what's a *Service Worker*.

