module.exports = {
  preset: 'jest-puppeteer',
  testPathIgnorePatterns: ['/node_modules/', '/.cache/', '/dist/'],
  globalTeardown: '<rootDir>/test/util/teardown.js',
  globalSetup: '<rootDir>/test/util/setup.js'
};
