import {passThrough} from './tables-utils.js';

import {init as $init} from './init.js';

export const init = (options = {}) => passThrough($init, options);
