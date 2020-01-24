import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import json from '@rollup/plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const BABEL_PLUGINS = [['@babel/proposal-class-properties']];
const BABEL_EXCLUDES = 'node_modules/**';

const BABEL_PRESETS = {
  IIFE: [
    [
      '@babel/env',
      {
        targets: { browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'] },
        loose: false,
        modules: false,
      },
    ],
  ],
  MODULE: [
    [
      '@babel/env',
      {
        targets: { esmodules: true },
        loose: true,
        modules: false,
      },
    ],
  ],
};

function rollupPlugins(module) {
  return [
    resolve(),
    json(),
    commonjs({
      namedExports: {
        'css-tree': [
          'clone',
          'find',
          'findAll',
          'findLast',
          'generate',
          'keyword',
          'parse',
          'property',
          'walk',
        ],
      },
    }),
    babel({
      exclude: BABEL_EXCLUDES,
      presets: module ? BABEL_PRESETS.MODULE : BABEL_PRESETS.IIFE,
      plugins: BABEL_PLUGINS,
    }),
    compiler(),
    terser(),
  ];
}

const IIFE = {
  input: 'out/index.js',
  output: {
    file: 'dist/viewer.js',
    format: 'iife',
    sourcemap: true,
    name: 'AMPEmail',
  },
  plugins: rollupPlugins(false),
};

const ESModule = {
  input: 'out/index.js',
  output: {
    file: 'dist/viewer.mjs',
    format: 'es',
    sourcemap: true,
  },
  plugins: rollupPlugins(true),
};

export default [IIFE, ESModule];
