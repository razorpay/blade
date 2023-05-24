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

  it('should throw error when variant is "subheading" but weight "regular" is passed', () => {
    try {
      const displayText = 'Get Started With Payment Gateway';
      renderWithTheme(
        // @ts-expect-error testing failure case when size is passed with variant='subheading'
        <Heading type="normal" variant="subheading" size="small">
          {displayText}
        </Heading>,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toMatchInlineSnapshot(
          `"[Blade: Heading]: size prop cannot be added when variant is 'subheading'. Use variant 'regular' or remove size prop"`,
        );
      }
    }
  });

  it('should accept testID', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { getByTestId } = renderWithTheme(<Heading testID="heading-test">{displayText}</Heading>);
    expect(getByTestId('heading-test')).toBeTruthy();
  });
});
