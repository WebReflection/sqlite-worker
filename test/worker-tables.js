importScripts('../dist/sw-tables.js');

sqliteWorker({
  dist: '../dist',
  name: 'test-db',
  tables: {
    todos: {
      id: 'INTEGER PRIMARY KEY',
      value: 'TEXT'
    }
  }
}).then(async ({all, get, query, raw}) => {
  const table = raw`todos`;
  const {total} = await get`SELECT COUNT(id) as total FROM ${table}`;
  if (total < 1) {
    console.log('Inserting some value');
    await query`INSERT INTO ${table} (value) VALUES (${'a'})`;
    await query`INSERT INTO ${table} (value) VALUES (${'b'})`;
    await query`INSERT INTO ${table} (value) VALUES (${'c'})`;
  }
  console.table(await all`SELECT * FROM todos`);
});
