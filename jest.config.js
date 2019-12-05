module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151001],
      },
    },
  },
  testEnvironment: 'jest-environment-jsdom-fourteen',
  testEnvironmentOptions: {
    runScripts: 'dangerously',
    resources: 'usable',
  },
  testPathIgnorePatterns: ['/node_modules/', '/out/', '/dist/', '/example/'],
};
