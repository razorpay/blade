import React from 'react';
import { Text } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Text />', () => {
  it('should render Text with default properties', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(<Text>{displayText}</Text>);
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Text with variant "body" and contrast "high"', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(
      <Text
        color="surface.text.gray.normal"
        variant="body"
        weight="semibold"
        truncateAfterLines={3}
      >
        {displayText}
      </Text>,
    );
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Text with variant "body"', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(
      <Text
        color="surface.text.gray.normal"
        variant="body"
        weight="semibold"
        truncateAfterLines={3}
      >
        {displayText}
      </Text>,
    );
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Text with color', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(
      <Text color="surface.text.gray.muted">{displayText}</Text>,
    );
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Text with variant "caption"', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(
      <Text color="surface.text.gray.normal" variant="body" weight="semibold">
        {displayText}
      </Text>,
    );
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Text with variant "body" and size "small"', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(
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
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Text with center textAlign', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(<Text textAlign="center">{displayText}</Text>);
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should throw error when variant is "caption" and size "large" is passed', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const displayText = 'Displaying some text';
    expect(() =>
      renderWithTheme(
        // TODO: something changed on types after forwarding refs. Check this once
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

  it('should render with as prop without errors', () => {
    const displayText = 'Displaying Text Screen';
    const { getByText } = renderWithTheme(
      <Text as="figcaption" color="surface.text.gray.muted" size="large">
        {displayText}
      </Text>,
    );
    expect(getByText(displayText)).toBeTruthy();
  });

  it('should accept testID', () => {
    const displayText = 'Displaying some text';
    const { getByTestId } = renderWithTheme(<Text testID="text-test">{displayText}</Text>);
    expect(getByTestId('text-test')).toBeTruthy();
  });
});
