const ignores = ['/node_modules/'];

module.exports = {
  roots: ['../packages/'],
  testPathIgnorePatterns: [...ignores, 'native.test'],
  collectCoverageFrom: ['../packages/**/*.web.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleFileExtensions: ['web.ts', 'web.tsx', 'ts', 'tsx', 'js', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.web.test.{ts,tsx}', '**/__tests__/**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(js|ts|tsx)?$': './jest-preprocess.js',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
