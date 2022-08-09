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
      <Title type="normal" variant="small" contrast="high">
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
      <Title type="normal" variant="small">
        {displayText}
      </Title>,
    );
    expect(getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(getByText('Displaying Landing Page Title')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Title with variant "medium"', () => {
    const displayText = 'Displaying Landing Page Title';
    const { container, getByRole, getByText } = renderWithTheme(
      <Title type="muted" variant="medium">
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
      <Title type="subdued" variant="large">
        {displayText}
      </Title>,
    );
    expect(getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(getByText('Displaying Landing Page Title')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should be accessible', async () => {
    const { container } = renderWithTheme(<Title>Text content</Title>);
    await assertAccessible(container);
  });
});
