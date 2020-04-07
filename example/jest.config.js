module.exports = {
  preset: 'jest-puppeteer',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.cache/',
    '/dist/',
    '/ampruntime/repo',
  ],
  globalTeardown: '<rootDir>/test/util/teardown.js',
  globalSetup: '<rootDir>/test/util/setup.js',
};
