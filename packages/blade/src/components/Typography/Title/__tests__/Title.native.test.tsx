import React from 'react';
import { Title } from '../';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Title />', () => {
  it('should render Title with default properties', () => {
    const displayText = 'Displaying Landing Screen Title';
    const { toJSON, getByText } = renderWithTheme(<Title>{displayText}</Title>);
    expect(getByText('Displaying Landing Screen Title')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Title with variant "small" and contrast "high"', () => {
    const displayText = 'Displaying Landing Screen Title';
    const { toJSON, getByText } = renderWithTheme(
      <Title type="normal" size="small" contrast="high">
        {displayText}
      </Title>,
    );
    expect(getByText('Displaying Landing Screen Title')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Title with variant "small"', () => {
    const displayText = 'Displaying Landing Screen Title';
    const { toJSON, getByText } = renderWithTheme(
      <Title type="normal" size="small">
        {displayText}
      </Title>,
    );
    expect(getByText('Displaying Landing Screen Title')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Title with color', () => {
    const displayText = 'Displaying Landing Page Title';
    const { toJSON } = renderWithTheme(
      <Title color="surface.text.subtle.highContrast">{displayText}</Title>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Title with variant "medium"', () => {
    const displayText = 'Displaying Landing Screen Title';
    const { toJSON, getByText } = renderWithTheme(
      <Title type="muted" size="medium">
        {displayText}
      </Title>,
    );
    expect(getByText('Displaying Landing Screen Title')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Title with variant "large"', () => {
    const displayText = 'Displaying Landing Screen Title';
    const { toJSON, getByText } = renderWithTheme(
      <Title type="subdued" size="large">
        {displayText}
      </Title>,
    );
    expect(getByText('Displaying Landing Screen Title')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const displayText = 'Displaying Landing Screen Title';
    const { getByTestId } = renderWithTheme(<Title testID="title-test">{displayText}</Title>);
    expect(getByTestId('title-test')).toBeTruthy();
  });
});
