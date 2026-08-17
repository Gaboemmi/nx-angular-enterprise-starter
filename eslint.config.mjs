import js from '@eslint/js';
import angular from 'angular-eslint';
import nx from '@nx/eslint-plugin';
import { readFileSync } from 'node:fs';
import tseslint from 'typescript-eslint';

import { createDependencyConstraints } from './tools/architecture-enforcement/src/lib/dependency-policy.mjs';

const typescriptFiles = ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'];
const businessScopes = JSON.parse(
  readFileSync(
    new URL('./tools/architecture-enforcement/business-scopes.json', import.meta.url),
    'utf8',
  ),
);

const withFiles = (configs, files) =>
  configs.map((config) => ({
    ...config,
    files,
  }));

export default [
  js.configs.recommended,
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...withFiles(tseslint.configs.strictTypeChecked, typescriptFiles),
  ...withFiles(tseslint.configs.stylisticTypeChecked, typescriptFiles),
  ...withFiles(angular.configs.tsRecommended, ['**/*.ts']),
  ...withFiles(angular.configs.templateRecommended, ['**/*.html']),
  ...withFiles(angular.configs.templateAccessibility, ['**/*.html']),
  {
    files: typescriptFiles,
    rules: {
      // Angular's decorators give otherwise empty classes a runtime role.
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: createDependencyConstraints(businessScopes),
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
