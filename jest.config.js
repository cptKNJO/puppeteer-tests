module.exports = {
  globalSetup: './setup.js',
  globalTeardown: './teardown.js',
  testEnvironment: './puppeteer_environment.js',
  testMatch: ['**/__tests__/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testTimeout: 20000,
  // maxWorkers: '50%',
};
