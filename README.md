# sqlite-worker

<sup>**Social Media Photo by [benjamin lehman](https://unsplash.com/@benjaminlehman) on [Unsplash](https://unsplash.com/)**</sup>

A simple, and persistent, SQLite database for Web and Workers, based on [sql.js](https://github.com/sql-js/sql.js#readme) and [sqlite-tag](https://github.com/WebReflection/sqlite-tag#readme).



## How to import this module

This module is pre-bundled in a way it should work, and survive, 3rd party tools, but it needs to be able to reach its own `dist` folder.

Accordingly, the easiest way to use this module is the following:

```js
// note: no ?module needed, this is already exported as ESM
import {init, SQLiteWorker} from '//unpkg.com/sqlite-worker';

// either direct init([options])
// or use SQLiteWorker with defaults
SQLiteWorker({name: 'my-db'}).then(() => {
  console.log('ready');
});
```

Options defaults, such as `dir` and `library`, or even the `Worker` path, are all resolved automatically, as long as all `dist` files are reachable.

It is, however, possible to change these configurations.



### Initialization Options

Both `init([options])` and `SQLiteWorker([options])` optionally accept a configuration/options object with the following fields:

  * **name**: the persistent database name. By default it's the *string* `'sqlite-worker'`
  * **database**: an initial SQLite database, as `Uint8Array` instance. This is used only the very first time, and it fallbacks to `new Uint8Array(0)`.
  * **timeout**: minimum interval, in milliseconds, between saves, to make storing, and exporting, the database, less greedy. By default it's the *number* `250`.


#### Direct init Extra Options

These options work only with direct initialization, so either in the main thread or via *Service Worker* after importing its `init` export.

  * **update**: a *function* that receives latest version of the database, as `Uint8Array`, whenever some query executed an `INSERT`, a `DELETE`, or an `UPDATE`.



#### SQLiteWorker Extra Options

These options work only with `SQLiteWorker` initialization.

  * **worker**: the *string* path where the *JS* worker to use is located. By default, this is the [dist/worker.js](./dist/worker.js) file, which is a pre-optimized version of [this source](./esm/worker.js).



#### Extra Options

These options are resolved by default internally to find the right files. Change these options only if you know what you are doing.

  * **dir**: where to find `sql.js` files. By default it's the current module folder plus `/../sqlite`.
  * **library**: where to find the `sqlite-worker` library itself. By default is wherever the module has been exported.




### Module exports

Both `init(...)` and `SQLiteWorker(...)` resolves with the [sqlite-tag API](https://github.com/WebReflection/sqlite-tag#api), except for the `raw` utility, which is not implemented via the *Worker* interface, but it's exported within the `init(...)`, as it requires a special instance that won't survive `postMessage` dance.

The API in a nutshell is:

  * **all**: a template literal tag to retrieve all rows that match the query
  * **get**: a template literal tag to retrieve one row that matches the query
  * **query**: a template literal tag to simply query the database (no result returned)

All tags are *asynchronous*, so that it's possible to *await* their result.



### Worker usage

If specified, you can pass your own worker via the `worker` option, but by default, this module can be initialized as such:

```js
import {SQLiteWorker} from 'sqlite-worker';

// SQLiteWorker([options])
SQLiteWorker({name: 'my-db'})
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

This module can also be used in the main thread, or be imported within a *Service Worker*, as opposite of creating a new worker from the main page.

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

Please note if you bundle this module there are chances it might not work as expected, as it needs to import *WASM* and other files at runtime, and bundlers might not give it a chance to find these files. Keep the `dist` folder as it is, and import this module from it.
