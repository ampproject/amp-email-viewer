module.exports = {
  singleQuote: true,
  trailingComma: 'es5',
  overrides: [
    {
      files: ['*.json'],
      options: {parser: 'json'},
    },
  ],
};
