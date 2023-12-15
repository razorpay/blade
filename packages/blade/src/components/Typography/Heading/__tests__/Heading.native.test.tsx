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
      <Heading color="surface.text.placeholder.lowContrast">{displayText}</Heading>,
    );
    expect(getByText(displayText)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with mixed color', () => {
    const { toJSON } = renderWithTheme(
      <Heading>
        Supercharge your business with the all‑powerful{' '}
        <Heading as="span" color="feedback.information.action.text.primary.default.lowContrast">
          Payment Gateway
        </Heading>
      </Heading>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with size "small" and contrast "high"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading type="normal" size="small" weight="regular" contrast="high">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with size "small"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading type="normal" size="small" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with size "medium"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading type="muted" size="medium" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with size "large"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading type="subdued" size="large" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with as prop without errors', () => {
    const displayText = 'Displaying Landing Screen Heading';
    const { getByText } = renderWithTheme(
      <Heading as="span" type="subdued" size="large">
        {displayText}
      </Heading>,
    );
    expect(getByText(displayText)).toBeTruthy();
  });

  it('should accept testID', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { getByTestId } = renderWithTheme(<Heading testID="heading-test">{displayText}</Heading>);
    expect(getByTestId('heading-test')).toBeTruthy();
  });
});
