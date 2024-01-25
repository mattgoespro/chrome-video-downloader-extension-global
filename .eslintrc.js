/** @type {import('eslint').Linter.BaseConfig} */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended"
  ],
  plugins: ["@typescript-eslint", "prettier"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json"
      },
      node: true,
      webpack: {
        config: "./webpack.base.ts"
      }
    },
    node: {
      tryExtensions: [".tsx"] // append tsx to the list as well
    },
    react: {
      version: "detect"
    }
  },
  ignorePatterns: [".eslintrc.js", "**/*.html"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }
    ],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", "type", "parent", "sibling"],
        warnOnUnassignedImports: true,
        "newlines-between": "never",
        alphabetize: {
          order: "asc",
          orderImportKind: "asc"
        }
      }
    ]
  },
  env: {
    webextensions: true
  }
};
