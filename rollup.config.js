import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const BABEL_PLUGINS = [['@babel/proposal-class-properties']];
const BABEL_EXCLUDES = 'node_modules/**';

const BABEL_IIFE_PRESETS = [
  [
    '@babel/env',
    {
      targets: { browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'] },
      loose: false,
      modules: false,
    },
  ],
];

const IIFE = {
  input: 'out/index.js',
  output: {
    file: 'dist/viewer.js',
    format: 'iife',
    sourcemap: true,
    name: 'AMPEmail',
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: BABEL_EXCLUDES,
      presets: BABEL_IIFE_PRESETS,
      plugins: BABEL_PLUGINS,
    }),
    compiler(),
    terser(),
  ],
};

const BABEL_MODULE_PRESETS = [
  [
    '@babel/env',
    {
      targets: { esmodules: true },
      loose: true,
      modules: false,
    },
  ],
];

const ESModule = {
  input: 'out/index.js',
  output: {
    file: 'dist/viewer.mjs',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: BABEL_EXCLUDES,
      presets: BABEL_MODULE_PRESETS,
      plugins: BABEL_PLUGINS,
    }),
    compiler(),
    terser(),
  ],
};

export default [IIFE, ESModule];
