import React from 'react';
import { TimePicker } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TimePicker />', () => {
  it('should render basic TimePicker with 12h format', () => {
    const { container } = renderWithTheme(
      <TimePicker label="Select meeting time" timeFormat="12h" />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with 24h format', () => {
    const { container } = renderWithTheme(
      <TimePicker label="Select meeting time" timeFormat="24h" />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with predefined value', () => {
    const defaultTime = new Date('2024-01-01T14:30:00');
    const { container } = renderWithTheme(
      <TimePicker label="Select meeting time" timeFormat="12h" defaultValue={defaultTime} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render disabled TimePicker', () => {
    const { container } = renderWithTheme(
      <TimePicker label="Select meeting time" timeFormat="12h" isDisabled={true} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with error state', () => {
    const { container } = renderWithTheme(
      <TimePicker
        label="Select meeting time"
        timeFormat="12h"
        validationState="error"
        errorText="Please select a valid time"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with success state', () => {
    const { container } = renderWithTheme(
      <TimePicker
        label="Select meeting time"
        timeFormat="12h"
        validationState="success"
        successText="Time selected successfully"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with different sizes', () => {
    const { container: containerMedium } = renderWithTheme(
      <TimePicker label="Medium TimePicker" size="medium" />,
    );

    const { container: containerLarge } = renderWithTheme(
      <TimePicker label="Large TimePicker" size="large" />,
    );

    expect(containerMedium).toMatchSnapshot();
    expect(containerLarge).toMatchSnapshot();
  });

  it('should render TimePicker with minute steps', () => {
    const { container } = renderWithTheme(
      <TimePicker label="Select meeting time" timeFormat="12h" minuteStep={15} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with help text', () => {
    const { container } = renderWithTheme(
      <TimePicker label="Select meeting time" helpText="Choose a time between 9 AM and 5 PM" />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <TimePicker label="Select time" testID="time-picker-test" />,
    );

    expect(getByTestId('time-picker-test')).toBeInTheDocument();
  });

  it('should render with accessibilityLabel', () => {
    const { container } = renderWithTheme(
      <TimePicker
        label="Select time"
        accessibilityLabel="Select appointment time for your medical visit"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with showFooterActions=false', () => {
    const { container } = renderWithTheme(
      <TimePicker label="Select time" timeFormat="12h" showFooterActions={false} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with required state', () => {
    const { container } = renderWithTheme(
      <TimePicker
        label="Select time"
        timeFormat="12h"
        isRequired={true}
        necessityIndicator="required"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with label position left', () => {
    const { container } = renderWithTheme(
      <TimePicker label="Select time" labelPosition="left" timeFormat="12h" />,
    );

    expect(container).toMatchSnapshot();
  });
});
