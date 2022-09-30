jest.autoMockOff();

import { defineTest } from 'jscodeshift/dist/testUtils';

const name = 'migrate-typography-v3';
const fixtures = ['basic'];

describe(name, () => {
  fixtures.forEach((test) =>
    defineTest(__dirname, name, null, `${name}/${test}`, {
      parser: 'js',
    }),
  );
});
