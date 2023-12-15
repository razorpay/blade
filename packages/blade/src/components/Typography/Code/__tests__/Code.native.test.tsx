import React from 'react';
import { Code } from '../Code';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { typography } from '~tokens/global';

describe('<Code />', () => {
  it('should render Code with default properties', () => {
    const { getByText, toJSON } = renderWithTheme(<Code>TEST_TOKEN</Code>);
    getByText('TEST_TOKEN');
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Code with color', () => {
    const { toJSON } = renderWithTheme(
      <Code isHighlighted={false} color="action.text.link.disabled">
        TEST_TOKEN
      </Code>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should throw error when color is set without isHighlighted false', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        // @ts-expect-error: expected error for negative test case
        <Code color="action.text.link.disabled">TEST_TOKEN</Code>,
      ),
    ).toThrow(`[Blade: Code]: \`color\` prop cannot be used without \`isHighlighted={false}\``);
    mockConsoleError.mockRestore();
  });

  it('should render small Code', () => {
    const { getByText, toJSON } = renderWithTheme(<Code size="small">SMALL</Code>);
    const renderedCode = getByText('SMALL');
    expect(renderedCode).toHaveStyle({ fontSize: typography.onMobile.fonts.size[25] });
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium Code', () => {
    const { getByText, toJSON } = renderWithTheme(<Code size="medium">MEDIUM</Code>);
    const renderedCode = getByText('MEDIUM');
    expect(renderedCode).toHaveStyle({ fontSize: typography.onMobile.fonts.size[75] });
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render isHighlighted false Code', () => {
    const { toJSON } = renderWithTheme(<Code isHighlighted={false}>NON-HIGHLIGHTED</Code>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Code testID="code-test">TEST_TOKEN</Code>);
    expect(getByTestId('code-test')).toBeTruthy();
  });
});
