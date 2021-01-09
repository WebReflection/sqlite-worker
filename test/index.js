export default async ({all, get, query, raw}) => {
  await query`CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, value TEXT)`;
  const {total} = await get`SELECT COUNT(id) as total FROM todos`;
  if (total < 1) {
    await query`INSERT INTO todos (value) VALUES (${'a'})`;
    await query`INSERT INTO todos (value) VALUES (${'b'})`;
    await query`INSERT INTO todos (value) VALUES (${'c'})`;
  }
  const results = await all`SELECT * FROM todos`;
  console.assert(results.length === 3, 'expected results');
  const result = await get`SELECT * FROM todos`;
  console.assert(JSON.stringify(result) === '{"id":1,"value":"a"}', 'expected result');
  try {
    await all`GET value FROM shenanigans`;
  }
  catch (o_O) {
    console.log('expected all failure', o_O);
  }
  try {
    await get`GET value FROM shenanigans`;
  }
  catch (o_O) {
    console.log('expected get failure', o_O);
  }
  try {
    await query`UPDATE shenanigans SET a = 1`;
  }
  catch (o_O) {
    console.log('expected query failure', o_O);
  }
  console.log('OK');
};
