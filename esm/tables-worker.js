import {passThrough} from './tables-utils.js';

import {SQLiteWorker as $SQLiteWorker} from './sqlite-worker.js';

export function SQLiteWorker(options = {}) {
  return passThrough($SQLiteWorker, options);
};
