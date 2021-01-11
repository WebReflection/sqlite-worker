import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
  input: './esm/worker.js',
  plugins: [
    nodeResolve()
  ],
  output: {
    esModule: false,
    file: './dist/tmp.js',
    format: 'iife'
  }
};
