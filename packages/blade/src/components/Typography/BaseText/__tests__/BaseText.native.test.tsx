import React from 'react';
import renderWithTheme from '../../../../_helpers/testing/renderWithTheme.native';
import BaseText from '../';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BaseText />', () => {
  it('should render regular text', () => {
    const displayText = 'Displaying some text';
    const renderedTree = renderWithTheme(
      <BaseText
        color="surface.text.normal.highContrast"
        fontFamily="text"
        lineHeight="m"
        fontSize={25}
        fontWeight="regular"
      >
        {displayText}
      </BaseText>,
    ).toJSON();
    expect(renderedTree).toMatchSnapshot();
  });

  it('should render text in italics style with line-through', () => {
    const displayText = 'Displaying some text';
    const renderedTree = renderWithTheme(
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
    ).toJSON();
    expect(renderedTree).toMatchSnapshot();
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
});
