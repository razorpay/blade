import React, { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { DatePicker as DatePickerComponent } from '..';
import { Box } from '~components/Box';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DatePicker/> ', () => {
  jest.setTimeout(10000);

  describe('onValidationStateChange', () => {
    it('fires with error when user types an invalid date and with none when cleared', async () => {
      const onValidationStateChange = jest.fn();
      const user = userEvent.setup();
      const { getByRole } = renderWithTheme(
        <DatePickerComponent
          accessibilityLabel="Select Date"
          onValidationStateChange={onValidationStateChange}
        />,
      );

      const input = getByRole('combobox', { name: /Select Date/i });
      // Type an invalid date (all 9s — impossible day/month)
      await user.type(input, '99999999');
      expect(onValidationStateChange).toHaveBeenCalledWith({ validationState: 'error' });

      // Clear the input
      await user.clear(input);
      expect(onValidationStateChange).toHaveBeenCalledWith({ validationState: 'none' });
    });

    it('fires with none when user corrects an invalid date by retyping', async () => {
      const onValidationStateChange = jest.fn();
      const user = userEvent.setup();
      const { getByRole } = renderWithTheme(
        <DatePickerComponent
          accessibilityLabel="Select Date"
          onValidationStateChange={onValidationStateChange}
        />,
      );

      const input = getByRole('combobox', { name: /Select Date/i });

      // Type an invalid date to trigger error
      await user.type(input, '99999999');
      expect(onValidationStateChange).toHaveBeenCalledWith({ validationState: 'error' });

      onValidationStateChange.mockClear();

      // Clear the input — handleInputChange fires with empty value, no validation error → 'none'
      await user.clear(input);
      expect(onValidationStateChange).toHaveBeenCalledWith({ validationState: 'none' });

      onValidationStateChange.mockClear();

      // Type a valid date — should not fire error again
      await user.type(input, '01012024');
      expect(onValidationStateChange).not.toHaveBeenCalledWith({ validationState: 'error' });
    });

    it('does not fire with error for a valid date input', async () => {
      const onValidationStateChange = jest.fn();
      const user = userEvent.setup();
      const { getByRole } = renderWithTheme(
        <DatePickerComponent
          accessibilityLabel="Select Date"
          onValidationStateChange={onValidationStateChange}
        />,
      );

      const input = getByRole('combobox', { name: /Select Date/i });
      // Type a valid date
      await user.type(input, '01012024');
      // Should not have fired with error
      expect(onValidationStateChange).not.toHaveBeenCalledWith({ validationState: 'error' });
    });

    it('fires callback and syncs display when validationState is controlled externally', async () => {
      const onValidationStateChange = jest.fn();
      const user = userEvent.setup();

      const ControlledDatePicker = (): React.ReactElement => {
        const [externalValidationState, setExternalValidationState] = React.useState<
          'error' | 'success' | 'none'
        >('none');

        return (
          <DatePickerComponent
            accessibilityLabel="Select Date"
            validationState={externalValidationState}
            onValidationStateChange={({ validationState }) => {
              setExternalValidationState(validationState);
              onValidationStateChange({ validationState });
            }}
          />
        );
      };

      const { getByRole } = renderWithTheme(<ControlledDatePicker />);
      const input = getByRole('combobox', { name: /Select Date/i });

      // Type invalid date — callback fires, consumer updates external validationState to 'error'
      await user.type(input, '99999999');
      expect(onValidationStateChange).toHaveBeenCalledWith({ validationState: 'error' });

      // Clear input — callback fires, consumer updates external validationState to 'none'
      await user.clear(input);
      expect(onValidationStateChange).toHaveBeenCalledWith({ validationState: 'none' });
    });

    it('preserves existing validationState prop behavior without onValidationStateChange', () => {
      const { queryByText } = renderWithTheme(
        <DatePickerComponent
          accessibilityLabel="Select Date"
          validationState="error"
          errorText="Invalid date format"
        />,
      );

      expect(queryByText('Invalid date format')).toBeInTheDocument();
    });
  });

  it('should fire native events like input and change', async () => {
    const handleInput = jest.fn();
    const handleChange = jest.fn();

    const DatePicker = (): React.ReactElement => {
      const ref = useRef<HTMLElement>(null);

      const addEventListeners = (): void => {
        if (ref.current) {
          ref.current.addEventListener('input', handleInput);
          ref.current.addEventListener('change', handleChange);
        }
      };

      const removeEventListeners = (): void => {
        if (ref.current) {
          ref.current.removeEventListener('input', handleInput);
          ref.current.removeEventListener('change', handleChange);
        }
      };

      useEffect(() => {
        addEventListeners();
        return removeEventListeners;
      }, []);

      return (
        <Box ref={ref}>
          <DatePickerComponent accessibilityLabel="Select Date" />
        </Box>
      );
    };

    const user = userEvent.setup();
    const { getByRole, queryByText } = renderWithTheme(<DatePicker />);

    const input = getByRole('combobox', { name: /Select Date/i });
    await user.click(input);

    await waitFor(() => expect(queryByText('Sun')).toBeVisible());

    const dateToSelect = dayjs().add(1, 'day');
    const date = getByRole('button', { name: dateToSelect.format('D MMMM YYYY') });
    await user.click(date);

    const applyButton = getByRole('button', { name: /Apply/i });
    await user.click(applyButton);
    expect(handleChange).toBeCalled();
    expect(handleInput).toBeCalled();
  });
});
