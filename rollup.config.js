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

function compile(input) {
  return {
    input: [input],
    output: {
      dir: 'dist/',
      format: 'iife'
    },
    plugins: [
      alias({
        entries: {
          '@models': path.resolve(__dirname, 'src/models'),
          '@services': path.resolve(__dirname, 'src/services'),
          '@components': path.resolve(__dirname, 'src/components'),
          '@pages': path.resolve(__dirname, 'src/pages'),
          "@styles": path.resolve(__dirname, 'sass'),
        }
      }),
      rollupNodeResolve({ jsnext: true, preferBuiltins: true, browser: true }),
      rollupJSON(),
      commonjs(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      postcss({
        plugins: [
          tailwindcss,
          autoprefixer
        ]
      }),
      typescript(),
      copy({
        targets: [
          { src: 'public/*.html', dest: 'dist/' }
        ]
      })
    ]
  }
}

export default [
  compile('src/viewer.tsx'),
  compile('src/configuration.tsx'),
  compile('src/queue.tsx'),
]
