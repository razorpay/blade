import React, { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { DatePicker as DatePickerComponent } from '..';
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
