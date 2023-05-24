import React from 'react';
import { BaseText } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BaseText />', () => {
  it('should render text with default properties', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(<BaseText>{displayText}</BaseText>);
    expect(container).toMatchSnapshot();
  });

  it('should render regular text', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <BaseText
        color="surface.text.normal.highContrast"
        fontFamily="text"
        lineHeight={100}
        fontSize={25}
        fontWeight="regular"
      >
        {displayText}
      </BaseText>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render text in italics style with line-through', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <BaseText
        color="surface.text.normal.highContrast"
        fontFamily="text"
        lineHeight={100}
        fontSize={25}
        fontWeight="regular"
        fontStyle="italic"
        textDecorationLine="line-through"
      >
        {displayText}
      </BaseText>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render text as paragraph element', () => {
    const displayText = 'Displaying some text';
    const { container } = renderWithTheme(
      <BaseText
        color="surface.text.normal.highContrast"
        fontFamily="text"
        lineHeight={100}
        fontSize={25}
        fontWeight="regular"
        fontStyle="italic"
        textDecorationLine="line-through"
        as="p"
      >
        {displayText}
      </BaseText>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const displayText = 'Displaying some text';
    const { getByTestId } = renderWithTheme(
      <BaseText testID="base-text-test">{displayText}</BaseText>,
    );
    expect(getByTestId('base-text-test')).toBeTruthy();
  });
});
