import React from 'react';
import dayjs from 'dayjs';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { DatePicker as DatePickerComponent } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DatePicker/> visibleMonth', () => {
  jest.setTimeout(10000);

  it('opens on defaultVisibleMonth instead of the selected value when no value is set', async () => {
    const anchorMonth = dayjs().subtract(4, 'month').toDate();

    const { getByRole, getAllByText, queryByText } = renderWithTheme(
      <DatePickerComponent
        selectionType="range"
        label={{ start: 'Compare to' }}
        defaultVisibleMonth={anchorMonth}
      />,
    );

    const user = userEvent.setup();
    const input = getByRole('combobox', { name: /Compare to/i });
    await user.click(input);

    await waitFor(() => expect(queryByText('Apply')).toBeVisible());
    expect(getAllByText(dayjs(anchorMonth).format('MMMM YYYY')).length).toBeGreaterThan(0);
  });

  it('gives visibleMonth priority over the first date of a controlled value', async () => {
    const anchorMonth = dayjs().subtract(6, 'month').toDate();
    const selectedRange = [dayjs().toDate(), dayjs().add(3, 'day').toDate()] as [Date, Date];

    const { getByRole, getAllByText, queryByText } = renderWithTheme(
      <DatePickerComponent
        selectionType="range"
        label={{ start: 'Compare to' }}
        value={selectedRange}
        visibleMonth={anchorMonth}
        onChange={() => undefined}
      />,
    );

    const user = userEvent.setup();
    const input = getByRole('combobox', { name: /Compare to/i });
    await user.click(input);

    await waitFor(() => expect(queryByText('Apply')).toBeVisible());
    expect(getAllByText(dayjs(anchorMonth).format('MMMM YYYY')).length).toBeGreaterThan(0);
  });
});
