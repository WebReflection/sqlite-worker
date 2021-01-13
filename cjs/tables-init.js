'use strict';
const {passThrough} = require('./tables-utils.js');

const {init: $init} = require('./init.js');

const init = (options = {}) => passThrough($init, options);
exports.init = init;
