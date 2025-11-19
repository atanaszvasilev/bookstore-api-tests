export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1,
  verbose: true,
  globalSetup: './jest.setup.ts',
  reporters: [
    'default',
    ['jest-allure2-reporter', { resultsDir: './output/allure-results' }]
  ],
};