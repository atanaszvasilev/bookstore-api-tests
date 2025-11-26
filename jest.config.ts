export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-allure2-reporter/environment-node',
  testRunner: 'jest-circus/runner',
  maxWorkers: 1,
  verbose: true,
  globalSetup: './jest.setup.ts',
  setupFilesAfterEnv: ['./jest.setup.tests.ts'],
  reporters: [
    'default',
    ['jest-allure2-reporter', { resultsDir: './output/allure-results' }]
  ],
};