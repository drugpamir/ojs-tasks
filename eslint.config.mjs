import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        module: "readonly", // Allow module globally
        require: "readonly", // Allow require globally
        process: "readonly", // Allow process globally
        __dirname: "readonly", // Allow __dirname globally
      },
    },
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["babel.config.js", "webpack.config.js"],
    rules: {
      "no-undef": "off", // Disable the no-undef rule for these files
      "@typescript-eslint/no-require-imports": "off", // Allow require imports
      "import/no-extraneous-dependencies": "off", // Disable any dependency rules
    },
  },
];
