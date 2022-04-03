const isE2E = /e2e/i.test(process.env.E2E);

module.exports = {
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: !!process.env.CI || !!process.env.COVERAGE,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '__fixtures__', '__mocks__', '__tests__'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  roots: ['<rootDir>/src'],
  globalSetup: isE2E ? './jest.setup.global.ts' : '',
  globalTeardown: isE2E ? './jest.teardown.global.ts' : '',
  setupFiles: ['./jest.setup.ts'],
  testMatch: [isE2E ? '<rootDir>/src/**/__tests__/**/*.ts' : '<rootDir>/src/**/__tests__/**/!(*.e2e).ts'],
};
