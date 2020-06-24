module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    "import/no-extraneous-dependencies": [
      2,
      { devDependencies: ["**/test.ts"] },
    ],
    "@typescript-eslint/indent": [2, 2],
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "prefer-const": [
      "error",
      {
        ignoreReadBeforeAssign: true,
      },
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
  },
};
