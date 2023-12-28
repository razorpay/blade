const ignores = ['/node_modules/'];

const rebrandedComponents = [
  'BaseBox',
  'BaseText',
  'BaseLink',
  'BaseButton',
  'Text',
  'Heading',
  'Display',
  'Code',
  'Button',
  'Link',
  'Counter',
  'Badge',
  'Indicator',
  'IconButton',
  'Divider',
  'ProgressBar',
  'Card',
  'List',
  'Tabs',
  'Box',
  'Accordion',
  'Collapsible',
  'Carousel',
  'BottomSheet',
  'Modal',
  'SkipNav',
  'VisuallyHidden',
];

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
  snapshotSerializers: ['<rootDir>/jestStyledComponentsSerializer.js'],
  moduleFileExtensions: ['web.ts', 'web.tsx', 'ts', 'tsx', 'js', 'json', 'node'],
  testMatch: rebrandedComponents.map((c) => `**/${c}.web.test.{ts,tsx}`),
  transform: {
    '\\.(js|ts|tsx)?$': './jest-preprocess.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!(@table-library)/)'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', './jest-setup.web.js'],
  moduleNameMapper: {
    '^\\~src/(.*)': '<rootDir>/src/$1',
    '^\\~components/(.*)': '<rootDir>/src/components/$1',
    '^\\~utils$': '<rootDir>/src/utils',
    '^\\~utils/(.*)': '<rootDir>/src/utils/$1',
    '^\\~tokens/(.*)': '<rootDir>/src/tokens/$1',
  },
  globals: {
    __DEV__: true,
  },
};

module.exports = {
  projects: [
    {
      displayName: 'SSR Test',
      ...baseConfig,
      testEnvironment: 'node',
      testPathIgnorePatterns: [...baseConfig.testPathIgnorePatterns, 'web.test'],
      collectCoverageFrom: rebrandedComponents.map((c) => `./src/**/${c}.ssr.{ts,tsx}`),
      testMatch: rebrandedComponents.map((c) => `**/${c}.ssr.test.{ts,tsx}`),
    },
    {
      displayName: 'CSR Test',
      ...baseConfig,
      testEnvironment: 'jsdom',
      testPathIgnorePatterns: [...baseConfig.testPathIgnorePatterns, 'ssr.test'],
      collectCoverageFrom: rebrandedComponents.map((c) => `./src/**/${c}.web.{ts,tsx}`),
    },
  ],
};
