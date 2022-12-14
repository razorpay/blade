const ignores = ['/node_modules/'];

const baseConfig = {
  testPathIgnorePatterns: [...ignores, 'native.test'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleFileExtensions: ['web.ts', 'web.tsx', 'ts', 'tsx', 'js', 'json', 'node'],
  testMatch: ['**/*.test.{ts,tsx}'],
  transform: {
    '\\.(js|ts|tsx)?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', './jest-setup.web.js'],
  moduleNameMapper: {
    '^\\~src/(.*)': '<rootDir>/src/$1',
    '^\\~components/(.*)': '<rootDir>/src/components/$1',
    '^\\~utils': '<rootDir>/src/utils',
    '^\\~tokens/(.*)': '<rootDir>/src/tokens/$1',
  },
};

module.exports = {
  projects: [
    {
      displayName: 'SSR Test',
      ...baseConfig,
      testEnvironment: 'node',
      testPathIgnorePatterns: [...baseConfig.testPathIgnorePatterns, 'web.test'],
      collectCoverageFrom: ['./src/**/*.ssr.{ts,tsx}'],
      testMatch: ['**/*.ssr.test.{ts,tsx}'],
    },
    {
      displayName: 'CSR Test',
      ...baseConfig,
      testEnvironment: 'jsdom',
      testPathIgnorePatterns: [...baseConfig.testPathIgnorePatterns, 'ssr.test'],
      collectCoverageFrom: ['./src/**/*.web.{ts,tsx}'],
    },
  ],
};
