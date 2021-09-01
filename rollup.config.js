import path from 'path';

import alias from '@rollup/plugin-alias';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve as rollupNodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import rollupJSON from 'rollup-plugin-json';

import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

function compile(input, server_url) {
  return {
    input: [input],
    output: {
      dir: 'dist/rollup/',
      format: 'iife',
      plugins: process.env.mini ? [terser()] : [],
    },
    plugins: [
      alias({
        entries: {
          '@models': path.resolve(__dirname, 'src/models'),
          '@services': path.resolve(__dirname, 'src/services'),
          '@components': path.resolve(__dirname, 'src/components'),
          '@pages': path.resolve(__dirname, 'src/pages'),
          '@styles': path.resolve(__dirname, 'sass'),
        },
      }),
      rollupNodeResolve({ jsnext: true, preferBuiltins: true, browser: true }),
      rollupJSON(),
      commonjs(),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('production'),
          EBS_SERVER_URL: server_url,
        },
      }),
      postcss({
        plugins: [tailwindcss, autoprefixer],
      }),
      typescript(),
      copy({
        targets: [{ src: 'public/*.html', dest: 'dist/rollup/' }],
      }),
    ],
  };
}

if (!process.env.SERVER) {
  throw Error('SERVER Environment Variable was not provided.');
}

let server;
switch (process.env.SERVER) {
  case 'prod':
    server = 'https://jd.tandashi.de';
    break;

  case 'dev':
    server = 'https://jd-dev.tandashi.de';
    break;

  case 'local':
  default:
    server = 'http://localhost:3000';
    break;
}

if (!server) {
  throw Error('No valid value for SERVER was defined. (local, dev, prod)');
}

export default [
  compile('src/viewer.tsx', server),
  compile('src/configuration.tsx', server),
  compile('src/live-config.tsx', server),
];
