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

  it('fires onVisibleMonthChange when navigating to the next month in controlled mode', async () => {
    const anchorMonth = dayjs().subtract(4, 'month').toDate();
    const onVisibleMonthChange = jest.fn();

    const { getByRole, queryByText } = renderWithTheme(
      <DatePickerComponent
        selectionType="range"
        label={{ start: 'Compare to' }}
        visibleMonth={anchorMonth}
        onVisibleMonthChange={onVisibleMonthChange}
      />,
    );

    const user = userEvent.setup();
    const input = getByRole('combobox', { name: /Compare to/i });
    await user.click(input);

    await waitFor(() => expect(queryByText('Apply')).toBeVisible());

    const nextButton = getByRole('button', { name: /Next/i });
    await user.click(nextButton);

    expect(onVisibleMonthChange).toHaveBeenCalledTimes(1);
    const calledDate = onVisibleMonthChange.mock.calls[0][0] as Date;
    // Range picker on desktop shows 2 columns, so "Next" advances by 2 months
    const expectedDate = dayjs(anchorMonth).add(2, 'month').toDate();
    expect(dayjs(calledDate).isSame(expectedDate, 'month')).toBe(true);
  });

  it('advances the calendar header after navigation when defaultVisibleMonth is set', async () => {
    const anchorMonth = dayjs().subtract(4, 'month').toDate();
    // Range picker on desktop shows 2 columns, so "Next" advances by 2 months
    const nextMonth = dayjs(anchorMonth).add(2, 'month');

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

    const nextButton = getByRole('button', { name: /Next/i });
    await user.click(nextButton);

    await waitFor(() =>
      expect(getAllByText(nextMonth.format('MMMM YYYY')).length).toBeGreaterThan(0),
    );
  });

  it('re-anchors to defaultVisibleMonth when the DatePicker is closed and reopened', async () => {
    const anchorMonth = dayjs().subtract(5, 'month').toDate();
    const anchorLabel = dayjs(anchorMonth).format('MMMM YYYY');

    const { getByRole, getAllByText, queryByText } = renderWithTheme(
      <DatePickerComponent
        selectionType="range"
        label={{ start: 'Compare to' }}
        defaultVisibleMonth={anchorMonth}
      />,
    );

    const user = userEvent.setup();
    const input = getByRole('combobox', { name: /Compare to/i });

    // Open
    await user.click(input);
    await waitFor(() => expect(queryByText('Apply')).toBeVisible());
    expect(getAllByText(anchorLabel).length).toBeGreaterThan(0);

    // Close via Cancel
    const cancelButton = getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);
    await waitFor(() => expect(queryByText('Apply')).not.toBeVisible());

    // Reopen
    await user.click(input);
    await waitFor(() => expect(queryByText('Apply')).toBeVisible());
    expect(getAllByText(anchorLabel).length).toBeGreaterThan(0);
  });
});
