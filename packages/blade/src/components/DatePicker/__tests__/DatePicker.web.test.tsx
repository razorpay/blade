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
    const { queryByLabelText } = renderWithTheme(
      <FilterChipDatePicker
        label="Date"
        selectionType="single"
        defaultValue={dayjs('1999-04-22').toDate()}
      />,
    );

    // pre-populated -> cross visible
    expect(queryByLabelText('Clear Date value')).toBeTruthy();

    await user.click(queryByLabelText('Clear Date value')!);

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
    const { queryByLabelText } = renderWithTheme(<Comp />);

    expect(queryByLabelText('Clear Date value')).toBeTruthy();
    await user.click(queryByLabelText('Clear Date value')!);

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
    const { queryByLabelText } = renderWithTheme(<Comp />);

    expect(queryByLabelText('Clear Date value')).toBeTruthy();
    await user.click(queryByLabelText('Clear Date value')!);

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
