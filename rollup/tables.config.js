import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

export default {
  input: './esm/tables.js',
  plugins: [
    nodeResolve(),
    terser()
  ],
  output: {
    esModule: false,
    file: './dist/tables.js'
  }
};
