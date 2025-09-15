import React from 'react';
import { I18nProvider } from '@react-aria/i18n';
import { TimePicker } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TimePicker />', () => {
  it('should render basic TimePicker with 12h format', () => {
    const { container } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker label="Select meeting time" timeFormat="12h" />
      </I18nProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with 24h format', () => {
    const { container } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker label="Select meeting time" timeFormat="24h" />
      </I18nProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with predefined value', () => {
    const defaultTime = new Date('2024-01-01T14:30:00');
    const { container } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker label="Select meeting time" timeFormat="12h" defaultValue={defaultTime} />
      </I18nProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render disabled TimePicker', () => {
    const { container } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker label="Select meeting time" timeFormat="12h" isDisabled={true} />
      </I18nProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with error state', () => {
    const { container } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker
          label="Select meeting time"
          timeFormat="12h"
          validationState="error"
          errorText="Please select a valid time"
        />
      </I18nProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with success state', () => {
    const { container } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker
          label="Select meeting time"
          timeFormat="12h"
          validationState="success"
          successText="Time selected successfully"
        />
      </I18nProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with different sizes', () => {
    const { container: containerMedium } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker label="Medium TimePicker" size="medium" />
      </I18nProvider>,
    );

    const { container: containerLarge } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker label="Large TimePicker" size="large" />
      </I18nProvider>,
    );

    expect(containerMedium).toMatchSnapshot();
    expect(containerLarge).toMatchSnapshot();
  });

  it('should render TimePicker with minute steps', () => {
    const { container } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker label="Select meeting time" timeFormat="12h" minuteStep={15} />
      </I18nProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with help text', () => {
    const { container } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker label="Select meeting time" helpText="Choose a time between 9 AM and 5 PM" />
      </I18nProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker label="Select time" testID="time-picker-test" />
      </I18nProvider>,
    );

    expect(getByTestId('time-picker-test')).toBeInTheDocument();
  });

  it('should render with accessibilityLabel', () => {
    const { container } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker
          label="Select time"
          accessibilityLabel="Select appointment time for your medical visit"
        />
      </I18nProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with showFooterActions=false', () => {
    const { container } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker label="Select time" timeFormat="12h" showFooterActions={false} />
      </I18nProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with required state', () => {
    const { container } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker
          label="Select time"
          timeFormat="12h"
          isRequired={true}
          necessityIndicator="required"
        />
      </I18nProvider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render TimePicker with label position left', () => {
    const { container } = renderWithTheme(
      <I18nProvider locale="en-US">
        <TimePicker label="Select time" labelPosition="left" timeFormat="12h" />
      </I18nProvider>,
    );

    expect(container).toMatchSnapshot();
  });
});
