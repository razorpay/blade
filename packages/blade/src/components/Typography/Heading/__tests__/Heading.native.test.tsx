import React from 'react';
import { Heading } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Heading />', () => {
  it('should render Heading with default properties', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(<Heading>{displayText}</Heading>);
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with color', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.disabled">{displayText}</Heading>,
    );
    expect(getByText(displayText)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with mixed color', () => {
    const { toJSON } = renderWithTheme(
      <Heading>
        Supercharge your business with the all‑powerful{' '}
        <Heading as="span" color="interactive.text.information.subtle">
          Payment Gateway
        </Heading>
      </Heading>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with size "small" and contrast "high"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.normal" size="small" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with size "small"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.normal" size="small" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with size "medium"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.muted" size="medium" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with size "large"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.muted" size="large" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with as prop without errors', () => {
    const displayText = 'Displaying Landing Screen Heading';
    const { getByText } = renderWithTheme(
      <Heading as="span" color="surface.text.gray.muted" size="large">
        {displayText}
      </Heading>,
    );
    expect(getByText(displayText)).toBeTruthy();
  });

  it('should render the serif variant in the heading font on React Native, with a warning', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { getByText, toJSON } = renderWithTheme(<Heading variant="serif">Hero</Heading>);
    const style = [getByText('Hero').props.style]
      .flat(Infinity)
      .reduce((all, s) => ({ ...all, ...s }), {});
    expect(style.fontFamily).toBe('TASA Orbiter Display');
    expect(style.fontWeight).toBe('400');
    expect(warnSpy).toHaveBeenCalledWith(
      '[Blade: Heading]: variant="serif" is web only for now. On React Native it renders in the default heading font at the same size and weight.',
    );
    expect(toJSON()).toMatchSnapshot();
    warnSpy.mockRestore();
  });

  it('should accept testID', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { getByTestId } = renderWithTheme(<Heading testID="heading-test">{displayText}</Heading>);
    expect(getByTestId('heading-test')).toBeTruthy();
  });
});
