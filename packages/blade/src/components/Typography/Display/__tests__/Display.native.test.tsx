import React from 'react';
import type { DisplayProps } from '..';
import { Display } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const sizes: DisplayProps['size'][] = ['small', 'medium', 'large', 'xlarge'];

describe('<Display />', () => {
  it('should render Display with default properties', () => {
    const displayText = 'Displaying Landing Screen Display';
    const { toJSON, getByText } = renderWithTheme(<Display>{displayText}</Display>);
    expect(getByText('Displaying Landing Screen Display')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Display with variant "small" and contrast "high"', () => {
    const displayText = 'Displaying Landing Screen Display';
    const { toJSON, getByText } = renderWithTheme(
      <Display color="surface.text.gray.normal" size="small">
        {displayText}
      </Display>,
    );
    expect(getByText('Displaying Landing Screen Display')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  sizes.forEach((size) => {
    it(`should render Display with variant "${size}"`, () => {
      const displayText = 'Displaying Landing Screen Display';
      const { toJSON, getByText } = renderWithTheme(
        <Display color="surface.text.gray.normal" size={size}>
          {displayText}
        </Display>,
      );
      expect(getByText('Displaying Landing Screen Display')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render Display with color', () => {
    const displayText = 'Displaying Landing Page Display';
    const { toJSON } = renderWithTheme(
      <Display color="surface.text.gray.subtle">{displayText}</Display>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Display with mixed color', () => {
    const { toJSON } = renderWithTheme(
      <Display>
        Supercharge your business with the all‑powerful{' '}
        <Display as="span" color="interactive.text.information.subtle">
          Payment Gateway
        </Display>
      </Display>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with as prop without errors', () => {
    const displayText = 'Displaying Landing Screen Display';
    const { getByText } = renderWithTheme(
      <Display as="span" color="surface.text.gray.muted" size="large">
        {displayText}
      </Display>,
    );
    expect(getByText(displayText)).toBeTruthy();
  });

  it('should accept testID', () => {
    const displayText = 'Displaying Landing Screen Display';
    const { getByTestId } = renderWithTheme(<Display testID="title-test">{displayText}</Display>);
    expect(getByTestId('title-test')).toBeTruthy();
  });
});
