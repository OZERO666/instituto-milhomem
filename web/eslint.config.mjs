import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'vite.config.js',
      'plugins/**',        // ← plugins do Horizons, não mexa
      'src/components/ui/**', // ← componentes shadcn gerados automaticamente
    ]
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: { react, 'react-hooks': reactHooks, import: importPlugin },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, React: 'readonly', Intl: 'readonly' },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        node: { extensions: ['.js', '.jsx'] },
        alias: { map: [['@', './src']], extensions: ['.js', '.jsx'] },
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...importPlugin.flatConfigs.recommended.rules,

      // React 17+ não precisa de React no escopo
      'react/prop-types':              'off',
      'react/no-unescaped-entities':   'off',
      'react/display-name':            'off',
      'react/jsx-uses-react':          'off',
      'react/react-in-jsx-scope':      'off',
      'react/jsx-uses-vars':           'off',
      'react/jsx-no-comment-textnodes':'off',

      // ← MELHORADO: warn em vez de off para pegar bugs de hooks
      'react-hooks/exhaustive-deps':   'warn',
      'react-hooks/rules-of-hooks':    'error',

      'no-unused-vars':                    'off',
      'no-undef':                          'error',
      'import/no-named-as-default':        'off',
      'import/no-named-as-default-member': 'off',
      'import/no-self-import':             'error',
      'import/no-cycle':                   'off',

      // ← ADICIONADO: pega erros comuns em produção
      'no-console':    ['warn', { allow: ['error', 'warn'] }],
      'no-debugger':   'error',
    },
  },
  {
    files: ['tools/**/*.js', 'tailwind.config.js'],
    languageOptions: { globals: globals.node },
  },
];
