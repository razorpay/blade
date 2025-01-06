import React from 'react';
import { Text } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Text />', () => {
  it('should render Text with default properties', () => {
    const displayText = 'Displaying some text';
    const { container, getByText } = renderWithTheme(<Text>{displayText}</Text>);
    expect(getByText(displayText).tagName).toBe('P');
    expect(container).toMatchSnapshot();
  });

  it('should render Text with variant "body" and contrast "high"', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <Text
        color="surface.text.gray.normal"
        variant="body"
        weight="semibold"
        truncateAfterLines={3}
      >
        {displayText}
      </Text>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Text with variant "body"', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <Text
        color="surface.text.gray.normal"
        variant="body"
        weight="semibold"
        truncateAfterLines={3}
      >
        {displayText}
      </Text>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Text with color', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <Text color="interactive.text.primary.subtle">{displayText}</Text>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Text with variant "caption"', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <Text color="surface.text.gray.normal" variant="body" weight="semibold">
        {displayText}
      </Text>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Text with variant "body" and size "small"', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <Text
        color="surface.text.gray.normal"
        variant="body"
        weight="semibold"
        truncateAfterLines={3}
        size="small"
      >
        {displayText}
      </Text>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Text with center textAlign', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text textAlign="center">{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('should throw error when variant is "caption" and size "large" is passed', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const displayText = 'Displaying some text';
    expect(() =>
      renderWithTheme(
        // TODO: something broke on ts after changing types. Check with Anurag on why this is happening
        // @ts-expect-error testing failure case when size='medium' is passed with variant='caption'
        <Text
          color="surface.text.gray.normal"
          variant="caption"
          truncateAfterLines={3}
          size="large"
        >
          {displayText}
        </Text>,
      ),
    ).toThrow(`[Blade: Text]: size cannot be 'large' when variant is 'caption'`);
    mockConsoleError.mockRestore();
  });

  it('should accept as prop and render appropriate HTML tag', () => {
    const displayText = 'Displaying some text';
    const { getByText } = renderWithTheme(<Text as="span">{displayText}</Text>);
    expect(getByText(displayText).tagName).toBe('SPAN');
  });

  it('should throw error on invalid as prop', () => {
    const displayText = 'Displaying some text';
    expect(() =>
      renderWithTheme(
        // @ts-expect-error testing failure case as prop is invalid
        <Text as="button">{displayText}</Text>,
      ),
    ).toThrow(
      '[Blade: Text]: Invalid `as` prop value - button. Only p, span, div, abbr, figcaption, cite, q, label are accepted',
    );
  });

  it('should accept testID', () => {
    const displayText = 'Displaying some text';
    const { getByTestId } = renderWithTheme(<Text testID="text-test">{displayText}</Text>);
    expect(getByTestId('text-test')).toBeTruthy();
  });
});
