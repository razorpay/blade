import React from 'react';
import { Text } from '../';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Text />', () => {
  it('should render Text with default properties', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<Text>{displayText}</Text>);
    expect(container).toMatchSnapshot();
  });

  it('should render Text with variant "body" and contrast "high"', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <Text type="normal" variant="body" weight="bold" truncateAfterLines={3} contrast="high">
        {displayText}
      </Text>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Text with variant "body"', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <Text type="normal" variant="body" weight="bold" truncateAfterLines={3}>
        {displayText}
      </Text>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Text with variant "caption"', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <Text type="normal" variant="body" weight="bold">
        {displayText}
      </Text>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Text with variant "body" and size "small"', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <Text type="normal" variant="body" weight="bold" truncateAfterLines={3} size="small">
        {displayText}
      </Text>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should throw error when variant is "caption" and size "small" is passed', () => {
    try {
      const displayText = 'Displaying some text';
      renderWithTheme(
        // @ts-expect-error testing failure case when size='small' is passed with variant='caption'
        <Text type="normal" variant="caption" truncateAfterLines={3} size="small">
          {displayText}
        </Text>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          `[Blade: Text]: size cannot be 'small' when variant is 'caption'`,
        );
      }
    }
  });

  it('should throw error when variant is "caption" but weight "bold" is passed', () => {
    try {
      const displayText = 'Displaying some text';
      renderWithTheme(
        <Text type="normal" variant="caption" weight="bold">
          {displayText}
        </Text>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          `[Blade: Text]: weight cannot be 'bold' when variant is 'caption'`,
        );
      }
    }
  });
});
