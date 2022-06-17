import React from 'react';
import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import { SkipNavContent, SkipNavLink } from '../SkipNav';

describe('<SkipNav />', () => {
  it('<SkipNavLink /> should throw error on native', () => {
    expect(() => renderWithTheme(<SkipNavLink />)).toThrow();
  });

  it('<SkipNavContent /> should throw error on native', () => {
    expect(() => renderWithTheme(<SkipNavContent />)).toThrow();
  });
});
