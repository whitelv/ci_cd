export default [
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        localStorage: "readonly",
        crypto: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn"
    }
  }
];
