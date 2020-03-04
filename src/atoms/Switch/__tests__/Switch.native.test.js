import React from 'react';

import Switch from '../index';
import { renderWithTheme } from '../../../_helpers/testing';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('Renders <Switch /> correctly', () => {
  it('renders a default Switch', () => {
    const { container } = renderWithTheme(<Switch />);
    expect(container).toMatchSnapshot();
  });

  it('renders a large Switch', () => {
    const { container } = renderWithTheme(<Switch size="large" />);
    expect(container).toMatchSnapshot();
  });

  it('renders a disabled/OFF Switch', () => {
    const { container } = renderWithTheme(<Switch disabled />);
    expect(container).toMatchSnapshot();
  });

  it('renders a disabled/ON Switch', () => {
    const { container } = renderWithTheme(<Switch disabled defaultOn={true} />);
    expect(container).toMatchSnapshot();
  });

  it('renders a controlled ON Switch', () => {
    const { container } = renderWithTheme(<Switch on={true} />);
    expect(container).toMatchSnapshot();
  });

  test('should throw an error when both defaultOn and on are passed as prop', () => {
    const errorMessage = 'Expected only one of defaultOn or on props.';
    expect(() =>
      renderWithTheme(<Switch defaultOn={true} on={false} onChange={() => {}} />),
    ).toThrow(errorMessage);
  });
});
