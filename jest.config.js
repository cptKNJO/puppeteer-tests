module.exports = {
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './puppeteer_environment.js',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};
