import React from 'react';
import { TimePicker } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

// Mock scrollIntoView for JSDOM environment
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: jest.fn(),
  writable: true,
});

describe('<TimePicker />', () => {
  it('should render basic TimePicker', () => {
    const { getByRole } = renderWithTheme(<TimePicker label="Select time" timeFormat="12h" />);

    expect(getByRole('combobox', { name: /Select time/i })).toBeInTheDocument();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <TimePicker label="Select time" testID="time-picker-test" />,
    );

    expect(getByTestId('time-picker-test')).toBeInTheDocument();
  });

  it('should render with different time formats', () => {
    const { getByRole: getByRole12h } = renderWithTheme(
      <TimePicker label="12h format" timeFormat="12h" />,
    );
    const { getByRole: getByRole24h } = renderWithTheme(
      <TimePicker label="24h format" timeFormat="24h" />,
    );

    expect(getByRole12h('combobox', { name: /12h format/i })).toBeInTheDocument();
    expect(getByRole24h('combobox', { name: /24h format/i })).toBeInTheDocument();
  });

  it('should render with different sizes', () => {
    const { getByRole: getByRoleMedium } = renderWithTheme(
      <TimePicker label="Medium" size="medium" />,
    );
    const { getByRole: getByRoleLarge } = renderWithTheme(
      <TimePicker label="Large" size="large" />,
    );

    expect(getByRoleMedium('combobox', { name: /Medium/i })).toBeInTheDocument();
    expect(getByRoleLarge('combobox', { name: /Large/i })).toBeInTheDocument();
  });

  it('should render disabled state', () => {
    const { getByRole } = renderWithTheme(<TimePicker label="Disabled" isDisabled={true} />);

    const input = getByRole('combobox', { name: /Disabled/i });
    expect(input).toHaveAttribute('aria-disabled', 'true');
  });

  it('should render with validation states', () => {
    const { getByText: getByTextError } = renderWithTheme(
      <TimePicker label="Error" validationState="error" errorText="Invalid time" />,
    );
    const { getByText: getByTextSuccess } = renderWithTheme(
      <TimePicker label="Success" validationState="success" successText="Valid time" />,
    );

    expect(getByTextError('Invalid time')).toBeInTheDocument();
    expect(getByTextSuccess('Valid time')).toBeInTheDocument();
  });

  it('should render with help text', () => {
    const { getByText } = renderWithTheme(
      <TimePicker label="With help" helpText="Choose a time" />,
    );

    expect(getByText('Choose a time')).toBeInTheDocument();
  });

  it('should render with accessibility label', () => {
    const { getByRole } = renderWithTheme(
      <TimePicker label="Time" accessibilityLabel="Select appointment time" />,
    );

    expect(getByRole('combobox', { name: /Select appointment time/i })).toBeInTheDocument();
  });

  it('should render required state', () => {
    const { getByText } = renderWithTheme(
      <TimePicker label="Required time" isRequired={true} necessityIndicator="required" />,
    );

    expect(getByText('*')).toBeInTheDocument();
  });

  it('should render with label position left', () => {
    const { getByRole } = renderWithTheme(<TimePicker label="Left label" labelPosition="left" />);

    expect(getByRole('combobox', { name: /Left label/i })).toBeInTheDocument();
  });
});
