import React from 'react';
import dayjs from 'dayjs';
import { fireEvent } from '@testing-library/react-native';
import { DatePicker } from '../DatePicker.native';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

/**
 * The real `@gorhom/bottom-sheet` `BottomSheetScrollView` cannot render inside jest
 * (see BottomSheet.native.test.tsx). We mock the Blade `BottomSheet` wrappers to plain
 * views so the calendar content is renderable and queryable in tests.
 */
jest.mock('~components/BottomSheet', () => {
  const ReactMock = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  return {
    BottomSheet: ({ children }: { children: React.ReactNode }) =>
      ReactMock.createElement(View, null, children),
    BottomSheetHeader: () => ReactMock.createElement(View, null),
    BottomSheetBody: ({ children }: { children: React.ReactNode }) =>
      ReactMock.createElement(View, null, children),
    BottomSheetFooter: ({ children }: { children: React.ReactNode }) =>
      ReactMock.createElement(View, null, children),
  };
});

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<DatePicker /> (native)', () => {
  it('should render a single date picker', () => {
    const { toJSON } = renderWithTheme(<DatePicker accessibilityLabel="Select Date" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a range date picker', () => {
    const { toJSON } = renderWithTheme(
      <DatePicker selectionType="range" label={{ start: 'Start', end: 'End' }} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should select a day and fire onChange + onApply on Apply', () => {
    const onChange = jest.fn();
    const onApply = jest.fn();

    const { getByLabelText, getByText } = renderWithTheme(
      <DatePicker accessibilityLabel="Select Date" onChange={onChange} onApply={onApply} />,
    );

    const dateToSelect = dayjs().date(15);
    const dayCell = getByLabelText(dateToSelect.format('D MMMM YYYY'));
    fireEvent.press(dayCell);

    expect(onChange).toHaveBeenCalled();

    fireEvent.press(getByText('Apply'));
    expect(onApply).toHaveBeenCalled();
  });

  it('should NOT fire onChange for an excluded date', () => {
    const onChange = jest.fn();
    const dateToExclude = dayjs().date(15);

    const { getByLabelText } = renderWithTheme(
      <DatePicker
        accessibilityLabel="Select Date"
        onChange={onChange}
        excludeDate={(date) => dayjs(date).isSame(dateToExclude, 'day')}
      />,
    );

    const dayCell = getByLabelText(dateToExclude.format('D MMMM YYYY'));
    fireEvent.press(dayCell);

    expect(onChange).not.toHaveBeenCalled();
  });
});
