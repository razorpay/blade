import React from 'react';
import { BaseText } from '../';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BaseText />', () => {
  it('should render text with default properties', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(<BaseText>{displayText}</BaseText>);
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render regular text', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(
      <BaseText
        color="surface.text.normal.highContrast"
        fontFamily="text"
        lineHeight="m"
        fontSize={25}
        fontWeight="regular"
      >
        {displayText}
      </BaseText>,
    );
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render text in italics style with line-through', () => {
    const displayText = 'Displaying some text';
    const { toJSON, getByText } = renderWithTheme(
      <BaseText
        color="surface.text.normal.highContrast"
        fontFamily="text"
        lineHeight="m"
        fontSize={25}
        fontWeight="regular"
        fontStyle="italic"
        textDecorationLine="line-through"
      >
        {displayText}
      </BaseText>,
    );
    expect(getByText('Displaying some text')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should throw error when "as" prop passed', () => {
    try {
      const displayText = 'Displaying some text';
      renderWithTheme(
        <BaseText
          color="surface.text.normal.highContrast"
          fontFamily="text"
          lineHeight="m"
          fontSize={25}
          fontWeight="regular"
          fontStyle="italic"
          textDecorationLine="line-through"
          as="p"
        >
          {displayText}
        </BaseText>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          `[Blade: BaseText]: "as" prop is not supported for BaseText on React Native`,
        );
      }
    }
  });

  it('should accept testID', () => {
    const displayText = 'Displaying some text';
    const { getByTestId } = renderWithTheme(
      <BaseText testID="base-text-test">{displayText}</BaseText>,
    );
    expect(getByTestId('base-text-test')).toBeTruthy();
  });
});
