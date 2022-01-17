const info = whichOne => {
  document.body.appendChild(
    document.createElement('p')
  ).textContent = whichOne;
};

export default async ({all, get, query, raw, transaction}) => {
  await query`CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, value TEXT)`;
  const {total} = await get`SELECT COUNT(id) as total FROM todos`;
  if (total < 1) {
    const populate = transaction();
    for (let i = 0; i < 300; i++) {
      populate`INSERT INTO todos (value) VALUES (${'a' + i})`;
      populate`INSERT INTO todos (value) VALUES (${'b' + i})`;
      populate`INSERT INTO todos (value) VALUES (${'c' + i})`;
    }
    await populate.commit();
  }
  const results = await all`SELECT * FROM todos`;
  console.assert(results.length === 900, 'expected results');
  const result = await get`SELECT * FROM todos`;
  console.assert(JSON.stringify(result) === '{"id":1,"value":"a0"}', 'expected result');
  try {
    await all`GET value FROM shenanigans`;
    info('Failed');
  }
  catch (o_O) {
    console.log('expected all failure', o_O);
  }
  try {
    await get`GET value FROM shenanigans`;
    info('Failed');
  }
  catch (o_O) {
    console.log('expected get failure', o_O);
  }
  try {
    await query`UPDATE shenanigans SET a = 1`;
    info('Failed');
  }
  catch (o_O) {
    console.log('expected query failure', o_O);
  }
  console.log('OK');
  info('OK');
};
