import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
  input: './esm/init.js',
  plugins: [
    nodeResolve()
  ],
  output: {
    esModule: false,
    file: './dist/tmp.js',
    format: 'commonjs'
  }
};
