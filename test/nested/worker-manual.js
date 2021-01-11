importScripts('../../dist/sw.js');

sqliteWorker({
  dist: '../../dist',
  name: 'test-db'
}).then(async ({all, get, query}) => {
  await query`CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, value TEXT)`;
  const {total} = await get`SELECT COUNT(id) as total FROM todos`;
  if (total < 1) {
    console.log('Inserting some value');
    await query`INSERT INTO todos (value) VALUES (${'a'})`;
    await query`INSERT INTO todos (value) VALUES (${'b'})`;
    await query`INSERT INTO todos (value) VALUES (${'c'})`;
  }
  console.table(await all`SELECT * FROM todos`);
});
