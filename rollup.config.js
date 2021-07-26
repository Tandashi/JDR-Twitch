import path from 'path';

import alias from '@rollup/plugin-alias';
import copy from 'rollup-plugin-copy'
import replace from '@rollup/plugin-replace';
import typescript from 'rollup-plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import * as nodeResolve from '@rollup/plugin-node-resolve';

import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export default {
  input: ['src/panel.tsx'],
  output: {
    dir: 'dist/',
    format: 'iife'
  },
  plugins: [
    alias({
      entries: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        "@styles": path.resolve(__dirname, 'sass'),
      }
    }),
    nodeResolve.nodeResolve(),
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
