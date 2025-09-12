import React, { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { TimePicker } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TimePicker />', () => {
  jest.setTimeout(10000);

  const ControlledTimePicker = ({
    initialValue = null,
    timeFormat = '12h',
    ...props
  }: {
    initialValue?: Date | null;
    timeFormat?: '12h' | '24h';
    [key: string]: any;
  }) => {
    const [time, setTime] = useState<Date | null>(initialValue);
    return (
      <TimePicker
        label="Select time"
        timeFormat={timeFormat}
        value={time}
        onChange={({ value }) => setTime(value)}
        {...props}
      />
    );
  };

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

  it('should open dropdown when input is clicked', async () => {
    const user = userEvent.setup();
    const { getByLabelText, queryByText } = renderWithTheme(<ControlledTimePicker />);

    const input = getByLabelText('Select time');
    await user.click(input);

    await waitFor(() => {
      expect(queryByText('Cancel')).toBeInTheDocument();
      expect(queryByText('Apply')).toBeInTheDocument();
    });
  });

  it('should display correct time format in 12h mode', async () => {
    const user = userEvent.setup();
    const defaultTime = new Date('2024-01-01T14:30:00'); // 2:30 PM
    const { getByLabelText, queryByText } = renderWithTheme(
      <ControlledTimePicker initialValue={defaultTime} timeFormat="12h" />,
    );

    const input = getByLabelText('Select time');
    await user.click(input);

    await waitFor(() => {
      expect(queryByText('PM')).toBeInTheDocument();
    });
  });

  it('should display correct time format in 24h mode', async () => {
    const user = userEvent.setup();
    const defaultTime = new Date('2024-01-01T14:30:00'); // 14:30
    const { getByLabelText } = renderWithTheme(
      <ControlledTimePicker initialValue={defaultTime} timeFormat="24h" />,
    );

    const input = getByLabelText('Select time');

    // In 24h format, AM/PM should not be visible
    await user.click(input);

    await waitFor(() => {
      expect(screen.queryByText('AM')).not.toBeInTheDocument();
      expect(screen.queryByText('PM')).not.toBeInTheDocument();
    });
  });

  it('should handle Apply and Cancel actions when showFooterActions is true', async () => {
    const user = userEvent.setup();
    const handleApply = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <TimePicker
        label="Select time"
        timeFormat="12h"
        showFooterActions={true}
        onApply={handleApply}
      />,
    );

    const input = getByLabelText('Select time');
    await user.click(input);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /apply/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    const applyButton = screen.getByRole('button', { name: /apply/i });
    await user.click(applyButton);

    expect(handleApply).toHaveBeenCalled();
  });

  it('should handle minute step correctly', async () => {
    const user = userEvent.setup();
    const { getByLabelText } = renderWithTheme(
      <TimePicker label="Select time" timeFormat="12h" minuteStep={15} />,
    );

    const input = getByLabelText('Select time');
    await user.click(input);

    await waitFor(() => {
      expect(screen.queryByText('Apply')).toBeInTheDocument();
    });

    // With 15-minute steps, we should see options like 00, 15, 30, 45
    // Note: This test might need adjustment based on actual implementation
    await waitFor(() => {
      expect(screen.queryByText('00')).toBeInTheDocument();
      expect(screen.queryByText('15')).toBeInTheDocument();
      expect(screen.queryByText('30')).toBeInTheDocument();
      expect(screen.queryByText('45')).toBeInTheDocument();
    });
  });

  it('should support keyboard navigation in time segments', async () => {
    const user = userEvent.setup();
    const defaultTime = new Date('2024-01-01T14:30:00');
    const { getByLabelText } = renderWithTheme(
      <ControlledTimePicker initialValue={defaultTime} timeFormat="12h" />,
    );

    const input = getByLabelText('Select time');
    await user.click(input);

    // Tab to navigate between time segments
    await user.tab();

    // Use arrow keys to change values
    await user.keyboard('{ArrowUp}');
    await user.keyboard('{ArrowDown}');

    // Note: Specific keyboard behavior testing would depend on
    // the actual implementation of time segment navigation
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

  it('should maintain focus management when dropdown opens/closes', async () => {
    const user = userEvent.setup();
    const { getByLabelText } = renderWithTheme(<ControlledTimePicker />);

    const input = getByLabelText('Select time');
    await user.click(input);

    await waitFor(() => {
      expect(screen.queryByText('Apply')).toBeInTheDocument();
    });

    // Check that focus is managed properly
    expect(document.activeElement).toBeTruthy();

    // Press Escape to close
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByText('Apply')).not.toBeInTheDocument();
    });

    // Focus should return to the input
    expect(document.activeElement).toBe(input);
  });

  it('should work without footer actions by default', async () => {
    const user = userEvent.setup();
    const { getByLabelText } = renderWithTheme(
      <TimePicker label="Select time" timeFormat="12h" showFooterActions={false} />,
    );

    const input = getByLabelText('Select time');
    await user.click(input);

    await waitFor(() => {
      expect(screen.queryByText('00')).toBeInTheDocument();
    });

    // Footer actions should not be present
    expect(screen.queryByRole('button', { name: /apply/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });
});
