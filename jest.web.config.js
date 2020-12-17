const ignores = ['/node_modules/'];

module.exports = {
  roots: ['src/'],
  testPathIgnorePatterns: [...ignores],
  collectCoverageFrom: ['./src/**/*.web.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleFileExtensions: ['web.ts', 'web.tsx', 'js', 'ts', 'tsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.web.test.tsx'],
  transform: {
    '\\.(ts|tsx)?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
