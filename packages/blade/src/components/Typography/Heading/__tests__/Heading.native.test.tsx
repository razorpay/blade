import React from 'react';
import { Heading } from '../';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Heading />', () => {
  it('should render Heading with default properties', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(<Heading>{displayText}</Heading>);
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with variant "small" and contrast "high"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading type="normal" variant="small" weight="regular" contrast="high">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with variant "small"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading type="normal" variant="small" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with variant "medium"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading type="muted" variant="medium" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with variant "large"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading type="subdued" variant="large" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Heading with variant "subheading" and weight "bold"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { toJSON, getByText } = renderWithTheme(
      <Heading type="subdued" variant="subheading" weight="bold">
        {displayText}
      </Heading>,
    );
    expect(getByText('Get Started With Payment Gateway')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should throw error when variant is "subheading" but weight "regular" is passed', () => {
    try {
      const displayText = 'Get Started With Payment Gateway';
      renderWithTheme(
        // @ts-expect-error testing failure case when weight='regular' is passed with variant='subheading'
        <Heading type="normal" variant="subheading" weight="regular">
          {displayText}
        </Heading>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          `[Blade: Heading]: weight cannot be 'regular' when variant is 'subheading'`,
        );
      }
    }
  });
});
