import React, { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { DatePicker as DatePickerComponent, FilterChipDatePicker } from '..';
import type { DatesRangeValue } from '../types';
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

describe('<FilterChipDatePicker/> clear button', () => {
  jest.setTimeout(15000);

  it('should clear the value when uncontrolled (defaultValue) and cross is clicked', async () => {
    const user = userEvent.setup();
    const { queryByLabelText, getByLabelText } = renderWithTheme(
      <FilterChipDatePicker
        label="Date"
        selectionType="single"
        defaultValue={dayjs('1999-04-22').toDate()}
      />,
    );

    // pre-populated -> cross visible
    expect(queryByLabelText('Clear Date value')).toBeTruthy();

    await user.click(getByLabelText('Clear Date value'));

    // cross gone -> chip back to default state
    expect(queryByLabelText('Clear Date value')).toBeFalsy();
  });

  it('should clear a controlled value when onChange resets it and fire both callbacks', async () => {
    const onChange = jest.fn();
    const onClearButtonClick = jest.fn();

    const Comp = (): React.ReactElement => {
      const [date, setDate] = React.useState<Date | undefined>(dayjs('1999-04-22').toDate());
      return (
        <FilterChipDatePicker
          label="Date"
          selectionType="single"
          value={date}
          onChange={(value) => {
            onChange(value);
            setDate(value as Date);
          }}
          onClearButtonClick={onClearButtonClick}
        />
      );
    };

    const user = userEvent.setup();
    const { queryByLabelText, getByLabelText } = renderWithTheme(<Comp />);

    expect(queryByLabelText('Clear Date value')).toBeTruthy();
    await user.click(getByLabelText('Clear Date value'));

    expect(onChange).toHaveBeenCalledWith(null);
    expect(onClearButtonClick).toHaveBeenCalledTimes(1);
    expect(queryByLabelText('Clear Date value')).toBeFalsy();
  });

  it('should fire onChange with [null, null] on clear for range selection', async () => {
    const onChange = jest.fn();
    const Comp = (): React.ReactElement => {
      const [date, setDate] = React.useState<DatesRangeValue>([
        dayjs('1999-04-22').toDate(),
        dayjs('1999-04-25').toDate(),
      ]);
      return (
        <FilterChipDatePicker
          label="Date"
          selectionType="range"
          value={date}
          onChange={(value) => {
            onChange(value);
            setDate(value as DatesRangeValue);
          }}
        />
      );
    };

    const user = userEvent.setup();
    const { queryByLabelText, getByLabelText } = renderWithTheme(<Comp />);

    expect(queryByLabelText('Clear Date value')).toBeTruthy();
    await user.click(getByLabelText('Clear Date value'));

    expect(onChange).toHaveBeenCalledWith([null, null]);
    expect(queryByLabelText('Clear Date value')).toBeFalsy();
  });

  it('should not render the clear button when showClearButton is false, even with a value', () => {
    const { queryByLabelText, queryByText } = renderWithTheme(
      <FilterChipDatePicker
        label="Date"
        selectionType="single"
        defaultValue={dayjs('1999-04-22').toDate()}
        showClearButton={false}
      />,
    );

    // value is shown (chip is selected) but the cross is hidden
    expect(queryByText('22/04/1999')).toBeTruthy();
    expect(queryByLabelText('Clear Date value')).toBeFalsy();
  });

  it('should render the clear button by default when a value is selected', () => {
    const { queryByLabelText } = renderWithTheme(
      <FilterChipDatePicker
        label="Date"
        selectionType="single"
        defaultValue={dayjs('1999-04-22').toDate()}
      />,
    );

    expect(queryByLabelText('Clear Date value')).toBeTruthy();
  });
});

describe('<FilterChipDatePicker/> open state', () => {
  jest.setTimeout(15000);

  // The flyout stays mounted after closing (floating-ui keeps it for the exit transition, which
  // never completes in jsdom), so presence in the DOM cannot be used to assert open/closed state.
  const expectExpanded = async (chip: HTMLElement, isExpanded: boolean): Promise<void> => {
    await waitFor(() =>
      expect(chip).toHaveAttribute('aria-expanded', isExpanded ? 'true' : 'false'),
    );
  };

  it('should reopen when a complete range is already selected (controlled)', async () => {
    const Comp = (): React.ReactElement => {
      const [isOpen, setIsOpen] = React.useState(false);
      const [date, setDate] = React.useState<DatesRangeValue>([
        dayjs('1999-04-22').toDate(),
        dayjs('1999-04-25').toDate(),
      ]);

      return (
        <FilterChipDatePicker
          label="Date"
          selectionType="range"
          isOpen={isOpen}
          onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
          value={date}
          onChange={(value) => setDate(value as DatesRangeValue)}
        />
      );
    };

    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(<Comp />);
    const chip = getByRole('combobox', { name: /Date/i });

    await user.click(chip);
    await expectExpanded(chip, true);

    // a fresh selection still commits and closes the flyout
    await user.click(getByRole('button', { name: '5 April 1999' }));
    await expectExpanded(chip, true);
    await user.click(getByRole('button', { name: '9 April 1999' }));
    await expectExpanded(chip, false);

    await user.click(chip);
    await expectExpanded(chip, true);
  });

  it('should reopen when a complete range is already selected (uncontrolled)', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <FilterChipDatePicker
        label="Date"
        selectionType="range"
        defaultValue={[dayjs('1999-04-22').toDate(), dayjs('1999-04-25').toDate()]}
      />,
    );
    const chip = getByRole('combobox', { name: /Date/i });

    await user.click(chip);
    await expectExpanded(chip, true);
  });

  it('should reopen when a date is already selected (controlled, single)', async () => {
    const Comp = (): React.ReactElement => {
      const [isOpen, setIsOpen] = React.useState(false);
      const [date, setDate] = React.useState<Date | undefined>(dayjs('1999-04-22').toDate());

      return (
        <FilterChipDatePicker
          label="Date"
          selectionType="single"
          isOpen={isOpen}
          onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
          value={date}
          onChange={(value) => setDate(value as Date)}
        />
      );
    };

    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(<Comp />);
    const chip = getByRole('combobox', { name: /Date/i });

    await user.click(chip);
    await expectExpanded(chip, true);

    await user.click(getByRole('button', { name: '10 April 1999' }));
    await expectExpanded(chip, false);

    await user.click(chip);
    await expectExpanded(chip, true);
  });

  it('should fire onOpenChange once per open and close (controlled)', async () => {
    const onOpenChange = jest.fn();
    const Comp = (): React.ReactElement => {
      const [isOpen, setIsOpen] = React.useState(false);
      const [date, setDate] = React.useState<DatesRangeValue>([null, null]);

      return (
        <FilterChipDatePicker
          label="Date"
          selectionType="range"
          isOpen={isOpen}
          onOpenChange={({ isOpen }) => {
            onOpenChange(isOpen);
            setIsOpen(isOpen);
          }}
          value={date}
          onChange={(value) => setDate(value as DatesRangeValue)}
        />
      );
    };

    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(<Comp />);
    const chip = getByRole('combobox', { name: /Date/i });

    await user.click(chip);
    await expectExpanded(chip, true);
    expect(onOpenChange).toHaveBeenCalledTimes(1);

    const start = dayjs().startOf('month').add(9, 'day');
    await user.click(getByRole('button', { name: start.format('D MMMM YYYY') }));
    await user.click(getByRole('button', { name: start.add(3, 'day').format('D MMMM YYYY') }));

    await expectExpanded(chip, false);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
