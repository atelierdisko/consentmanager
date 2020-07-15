/*
 * Copyright 2020 Atelier Disko. All rights reserved.
 *
 * Use of this source code is governed by the AD General Software
 * License v1 that can be found under https://atelierdisko.de/licenses
 *
 * This software is proprietary and confidential. Redistribution
 * not permitted. Unless required by applicable law or agreed to
 * in writing, software distributed on an "AS IS" BASIS, WITHOUT-
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 */

import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';


export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/es/adtelierdisko-consentmanager.js',
      format: 'es',
    },
    {
      file: 'dist/adtelierdisko-consentmanager.js',
      format: 'cjs',
    },
    {
      file: 'dist/browser/adtelierdisko-consentmanager.min.js',
      format: 'iife',
      name: 'adcm',
      plugins: [
        terser(),
      ]
    },
  ],
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    babel(),
  ]
};
