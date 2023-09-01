import React from 'react';
import type { DisplayProps } from '../';
import { Display } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const sizes: DisplayProps['size'][] = ['small', 'medium', 'large', 'xlarge'];
const headingLevels = {
  small: 3,
  medium: 2,
  large: 1,
  xlarge: 1,
};

describe('<Display />', () => {
  it('should render Display with default properties', () => {
    const displayText = 'Displaying Landing Page Display';
    const { container, getByRole, getByText } = renderWithTheme(<Display>{displayText}</Display>);
    expect(getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(getByText('Displaying Landing Page Display')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Display with variant "small" and contrast "high"', () => {
    const displayText = 'Displaying Landing Page Display';
    const { container, getByRole, getByText } = renderWithTheme(
      <Display type="normal" size="small" contrast="high">
        {displayText}
      </Display>,
    );
    expect(getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(getByText('Displaying Landing Page Display')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Display with color', () => {
    const displayText = 'Displaying Landing Page Display';
    const { container, getByRole } = renderWithTheme(
      <Display color="surface.text.subtle.highContrast">{displayText}</Display>,
    );
    expect(getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Display with mixed color', () => {
    const { container } = renderWithTheme(
      <Display>
        Supercharge your business with the all‑powerful{' '}
        <Display as="span" color="feedback.information.action.text.primary.default.lowContrast">
          Payment Gateway
        </Display>
      </Display>,
    );
    expect(container).toMatchSnapshot();
  });

  sizes.forEach((size) => {
    it(`should render Display with size "${size}"`, () => {
      const displayText = 'Displaying Landing Page Display';
      const { container, getByRole, getByText } = renderWithTheme(
        <Display type="muted" size={size}>
          {displayText}
        </Display>,
      );
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      expect(getByRole('heading', { level: headingLevels[size!] })).toBeInTheDocument();
      expect(getByText('Displaying Landing Page Display')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });
  });

  it('should accept as prop and render appropriate HTML tag', () => {
    const displayText = 'Displaying some text';
    const { getByText } = renderWithTheme(<Display as="span">{displayText}</Display>);
    expect(getByText(displayText).tagName).toBe('SPAN');
  });

  it('should throw error on invalid as prop', () => {
    const displayText = 'Displaying some text';
    expect(() =>
      renderWithTheme(
        // @ts-expect-error testing failure case as prop is invalid
        <Display as="button">{displayText}</Display>,
      ),
    ).toThrow(
      '[Blade: Display]: Invalid `as` prop value - button. Only span, h1, h2, h3, h4, h5, h6 are accepted',
    );
  });

  it('should be accessible', async () => {
    const { container } = renderWithTheme(<Display>Text content</Display>);
    await assertAccessible(container);
  });

  it('should accept testID', () => {
    const displayText = 'Displaying Landing Screen Display';
    const { getByTestId } = renderWithTheme(<Display testID="title-test">{displayText}</Display>);
    expect(getByTestId('title-test')).toBeTruthy();
  });
});
