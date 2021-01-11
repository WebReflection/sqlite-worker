export default async ({all, get, query, raw}) => {
  await query`CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, value TEXT)`;
  const {total} = await get`SELECT COUNT(id) as total FROM todos`;
  if (total < 1) {
    for (let i = 0; i < 300; i++) {
      await query`INSERT INTO todos (value) VALUES (${'a' + i})`;
      await query`INSERT INTO todos (value) VALUES (${'b' + i})`;
      await query`INSERT INTO todos (value) VALUES (${'c' + i})`;
    }
  }
  const results = await all`SELECT * FROM todos`;
  console.assert(results.length === 900, 'expected results');
  const result = await get`SELECT * FROM todos`;
  console.assert(JSON.stringify(result) === '{"id":1,"value":"a0"}', 'expected result');
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
