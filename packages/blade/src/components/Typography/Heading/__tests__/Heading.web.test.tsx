import React from 'react';
import { Heading } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Heading />', () => {
  it('should render Heading with default properties', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { container, getByRole, getByText } = renderWithTheme(<Heading>{displayText}</Heading>);
    expect(getByRole('heading', { level: 6 })).toBeInTheDocument();
    expect(getByText('Get Started With Payment Gateway')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Heading with size "small" and contrast "high"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { container, getByRole, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.normal" size="small" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByRole('heading', { level: 6 })).toBeInTheDocument();
    expect(getByText('Get Started With Payment Gateway')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Heading with color', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { container } = renderWithTheme(
      <Heading color="surface.text.gray.disabled">{displayText}</Heading>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Heading with mixed color', () => {
    const { container } = renderWithTheme(
      <Heading>
        Supercharge your business with the all‑powerful{' '}
        <Heading as="span" color="interactive.text.information.subtle">
          Payment Gateway
        </Heading>
      </Heading>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Heading with size "small"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { container, getByRole, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.normal" size="small" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByRole('heading', { level: 6 })).toBeInTheDocument();
    expect(getByText('Get Started With Payment Gateway')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Heading with size "medium"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { container, getByRole, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.muted" size="medium" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByRole('heading', { level: 5 })).toBeInTheDocument();
    expect(getByText('Get Started With Payment Gateway')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Heading with size "large"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { container, getByRole, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.muted" size="large" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByRole('heading', { level: 4 })).toBeInTheDocument();
    expect(getByText('Get Started With Payment Gateway')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should accept as prop and render appropriate HTML tag', () => {
    const displayText = 'Displaying some text';
    const { getByText } = renderWithTheme(<Heading as="span">{displayText}</Heading>);
    expect(getByText(displayText).tagName).toBe('SPAN');
  });

  it('should throw error on invalid as prop', () => {
    const displayText = 'Displaying some text';
    expect(() =>
      renderWithTheme(
        // @ts-expect-error testing failure case as prop is invalid
        <Heading as="button">{displayText}</Heading>,
      ),
    ).toThrow(
      '[Blade: Heading]: Invalid `as` prop value - button. Only span, h1, h2, h3, h4, h5, h6 are accepted',
    );
  });

  it('should be accessible', async () => {
    const { container } = renderWithTheme(<Heading>Text content</Heading>);
    await assertAccessible(container);
  });

  it('should accept testID', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { getByTestId } = renderWithTheme(<Heading testID="heading-test">{displayText}</Heading>);
    expect(getByTestId('heading-test')).toBeTruthy();
  });
});
