import React from 'react';
import renderWithTheme from '../../../../_helpers/testing/renderWithTheme.native';
import BaseText from '../';
import { ERROR_AS_PROP_NOT_SUPPORTED } from '../StyledBaseText.native';
import { getInvalidPropValueError } from '../BaseText';

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
      ).toJSON();
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(ERROR_AS_PROP_NOT_SUPPORTED);
      }
    }
  });

  it('should fail when incorrect color passed', () => {
    const displayText = 'Displaying some text';
    const color = 'somerandomcolor';
    try {
      renderWithTheme(
        <BaseText
          // @ts-expect-error testing the invalid value for color prop error case
          color={color}
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          getInvalidPropValueError({ propName: 'color', propValue: color }),
        );
      }
    }
  });
  it('should fail when incorrect fontFamily passed', () => {
    const displayText = 'Displaying some text';
    const fontFamily = 'somerandom';
    try {
      renderWithTheme(
        <BaseText
          color="surface.text.normal.highContrast"
          // @ts-expect-error testing the invalid value for fontFamily prop error case
          fontFamily={fontFamily}
          lineHeight="m"
          fontSize={25}
          fontWeight="regular"
          fontStyle="italic"
          textDecorationLine="line-through"
        >
          {displayText}
        </BaseText>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          getInvalidPropValueError({ propName: 'fontFamily', propValue: fontFamily }),
        );
      }
    }
  });

  it('should fail when incorrect fontSize passed', () => {
    const displayText = 'Displaying some text';
    const fontSize = 1588;
    try {
      renderWithTheme(
        <BaseText
          color="surface.text.normal.highContrast"
          fontFamily="text"
          lineHeight="m"
          // @ts-expect-error testing the invalid value for fontSize prop error case
          fontSize={1588}
          fontWeight="regular"
          fontStyle="italic"
          textDecorationLine="line-through"
        >
          {displayText}
        </BaseText>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          getInvalidPropValueError({ propName: 'fontSize', propValue: fontSize }),
        );
      }
    }
  });

  it('should fail when incorrect fontWeight passed', () => {
    const displayText = 'Displaying some text';
    const fontWeight = 'somerandom';
    try {
      renderWithTheme(
        <BaseText
          color="surface.text.normal.highContrast"
          fontFamily="text"
          lineHeight="m"
          fontSize={25}
          // @ts-expect-error testing the invalid value for fontWeight prop error case
          fontWeight={fontWeight}
          fontStyle="italic"
          textDecorationLine="line-through"
        >
          {displayText}
        </BaseText>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          getInvalidPropValueError({ propName: 'fontWeight', propValue: fontWeight }),
        );
      }
    }
  });

  it('should fail when incorrect fontStyle passed', () => {
    const displayText = 'Displaying some text';
    const fontStyle = 'somerandom';
    try {
      renderWithTheme(
        <BaseText
          color="surface.text.normal.highContrast"
          fontFamily="text"
          lineHeight="m"
          fontSize={25}
          fontWeight="regular"
          // @ts-expect-error testing the invalid value for fontStyle prop error case
          fontStyle={fontStyle}
          textDecorationLine="line-through"
        >
          {displayText}
        </BaseText>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          getInvalidPropValueError({ propName: 'fontStyle', propValue: fontStyle }),
        );
      }
    }
  });

  it('should fail when incorrect textDecorationLine passed', () => {
    const displayText = 'Displaying some text';
    const textDecorationLine = 'somerandom';
    try {
      renderWithTheme(
        <BaseText
          color="surface.text.normal.highContrast"
          fontFamily="text"
          lineHeight="m"
          fontSize={25}
          fontWeight="regular"
          fontStyle="italic"
          // @ts-expect-error testing the invalid value for textDecorationLine prop error case
          textDecorationLine={textDecorationLine}
        >
          {displayText}
        </BaseText>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          getInvalidPropValueError({
            propName: 'textDecorationLine',
            propValue: textDecorationLine,
          }),
        );
      }
    }
  });

  it('should fail when incorrect lineHeight passed', () => {
    const displayText = 'Displaying some text';
    const lineHeight = 'somerandom';
    try {
      renderWithTheme(
        <BaseText
          color="surface.text.normal.highContrast"
          fontFamily="text"
          // @ts-expect-error testing the invalid value for lineHeight prop error case
          lineHeight={lineHeight}
          fontSize={25}
          fontWeight="regular"
          fontStyle="italic"
          textDecorationLine="line-through"
        >
          {displayText}
        </BaseText>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          getInvalidPropValueError({ propName: 'lineHeight', propValue: lineHeight }),
        );
      }
    }
  });

  it('should fail when incorrect textAlign passed', () => {
    const displayText = 'Displaying some text';
    const textAlign = 'somerandom';
    try {
      renderWithTheme(
        <BaseText
          color="surface.text.normal.highContrast"
          fontFamily="text"
          lineHeight="m"
          fontSize={25}
          fontWeight="regular"
          fontStyle="italic"
          textDecorationLine="line-through"
          // @ts-expect-error testing the invalid value for textAlign prop error case
          textAlign={textAlign}
        >
          {displayText}
        </BaseText>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          getInvalidPropValueError({ propName: 'textAlign', propValue: textAlign }),
        );
      }
    }
  });
});
