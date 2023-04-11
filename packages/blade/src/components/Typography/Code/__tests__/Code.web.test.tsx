import React from 'react';
import { Code } from '../Code';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { makeSpace, makeTypographySize } from '~utils';
import typography from '~tokens/global/typography';
import spacing from '~tokens/global/spacing';

describe('<Code />', () => {
  it('should render Code with default properties', () => {
    const { container, getByText } = renderWithTheme(<Code>TEST_TOKEN</Code>);
    expect(getByText('TEST_TOKEN')).toHaveStyle(
      `font-size: ${makeTypographySize(typography.onDesktop.fonts.size[25])}`,
    );
    expect(container.querySelector('span')).toHaveStyle(
      `padding: ${makeSpace(spacing[0])} ${makeSpace(spacing[2])}`,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render small Code', () => {
    const { container, getByText } = renderWithTheme(<Code size="small">SMALL</Code>);
    expect(getByText('SMALL')).toHaveStyle(
      `font-size: ${makeTypographySize(typography.onDesktop.fonts.size[25])}`,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render medium Code', () => {
    const { container, getByText } = renderWithTheme(<Code size="medium">MEDIUM</Code>);
    expect(getByText('MEDIUM')).toHaveStyle(
      `font-size: ${makeTypographySize(typography.onDesktop.fonts.size[75])}`,
    );
    expect(container).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Code testID="code-test">TEST_TOKEN</Code>);
    expect(getByTestId('code-test')).toBeTruthy();
  });
});
