import { defineTest } from 'jscodeshift/dist/testUtils';

describe('blade-old-icons', () => {
  defineTest(__dirname, 'blade-old-icons', null, `blade-old-icons/basic`, {
    parser: 'tsx',
  });
});
