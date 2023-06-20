import React from 'react';
import { Title } from '../';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Title />', () => {
  it('should render Title with default properties', () => {
    const displayText = 'Displaying Landing Page Title';
    const { container, getByRole, getByText } = renderWithTheme(<Title>{displayText}</Title>);
    expect(getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(getByText('Displaying Landing Page Title')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Title with variant "small" and contrast "high"', () => {
    const displayText = 'Displaying Landing Page Title';
    const { container, getByRole, getByText } = renderWithTheme(
      <Title type="normal" size="small" contrast="high">
        {displayText}
      </Title>,
    );
    expect(getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(getByText('Displaying Landing Page Title')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Title with variant "small"', () => {
    const displayText = 'Displaying Landing Page Title';
    const { container, getByRole, getByText } = renderWithTheme(
      <Title type="normal" size="small">
        {displayText}
      </Title>,
    );
    expect(getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(getByText('Displaying Landing Page Title')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Title with color', () => {
    const displayText = 'Displaying Landing Page Title';
    const { container, getByRole } = renderWithTheme(
      <Title color="surface.text.subtle.highContrast">{displayText}</Title>,
    );
    expect(getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Title with variant "medium"', () => {
    const displayText = 'Displaying Landing Page Title';
    const { container, getByRole, getByText } = renderWithTheme(
      <Title type="muted" size="medium">
        {displayText}
      </Title>,
    );
    expect(getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(getByText('Displaying Landing Page Title')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Title with variant "large"', () => {
    const displayText = 'Displaying Landing Page Title';
    const { container, getByRole, getByText } = renderWithTheme(
      <Title type="subdued" size="large">
        {displayText}
      </Title>,
    );
    expect(getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(getByText('Displaying Landing Page Title')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should accept as prop and render appropriate HTML tag', () => {
    const displayText = 'Displaying some text';
    const { getByText } = renderWithTheme(<Title as="span">{displayText}</Title>);
    expect(getByText(displayText).tagName).toBe('SPAN');
  });

  it('should throw error on invalid as prop', () => {
    const displayText = 'Displaying some text';
    expect(() =>
      renderWithTheme(
        // @ts-expect-error testing failure case as prop is invalid
        <Title as="button">{displayText}</Title>,
      ),
    ).toThrow(
      '[Blade Title]: Invalid `as` prop value - button. Only span, h1, h2, h3, h4, h5, h6 are accepted',
    );
  });

  it('should be accessible', async () => {
    const { container } = renderWithTheme(<Title>Text content</Title>);
    await assertAccessible(container);
  });

  it('should accept testID', () => {
    const displayText = 'Displaying Landing Screen Title';
    const { getByTestId } = renderWithTheme(<Title testID="title-test">{displayText}</Title>);
    expect(getByTestId('title-test')).toBeTruthy();
  });
});
