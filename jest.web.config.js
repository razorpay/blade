const ignores = ['/node_modules/'];

module.exports = {
  roots: ['src/'],
  testPathIgnorePatterns: [...ignores],
  collectCoverageFrom: ['./src/**/*.web.{js,jsx}'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleFileExtensions: ['web.js', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.web.test.js'],
  transform: {
    '\\.(js|jsx)?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
