import React from 'react';
import renderWithTheme from '../../../../_helpers/testing/renderWithTheme.native';
import Text from '../';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Text />', () => {
  it('should render Text with default properties', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(<Text>{displayText}</Text>);
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Text with variant "body"', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(
      <Text type="normal" variant="body" weight="bold" truncateAfterLines={3}>
        {displayText}
      </Text>,
    );
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Text with variant "caption"', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(
      <Text type="normal" variant="body" weight="bold">
        {displayText}
      </Text>,
    );
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should throw error when variant is "caption" but weight "bold" is passed', () => {
    try {
      const displayText = 'Displaying some text';
      renderWithTheme(
        // @ts-expect-error testing failure case when weight='bold' is passed with variant='caption'
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
