import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { SegmentedControl } from '../SegmentedControl';
import { SegmentedControlItem } from '../SegmentedControlItem';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SegmentedControl /> (native)', () => {
  it('should render with default props', () => {
    const { toJSON, getAllByRole } = renderWithTheme(
      <SegmentedControl defaultValue="daily">
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
      </SegmentedControl>,
    );

    expect(getAllByRole('radio')).toHaveLength(3);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle selection change', () => {
    const onChange = jest.fn();

    const { getAllByRole } = renderWithTheme(
      <SegmentedControl defaultValue="daily" onChange={onChange}>
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      </SegmentedControl>,
    );

    const radios = getAllByRole('radio');
    fireEvent.press(radios[1]);
    expect(onChange).toHaveBeenCalledWith('weekly');
  });

  it('should disable all items when isDisabled is true', () => {
    const onChange = jest.fn();

    const { getAllByRole } = renderWithTheme(
      <SegmentedControl isDisabled defaultValue="daily" onChange={onChange}>
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      </SegmentedControl>,
    );

    const radios = getAllByRole('radio');
    fireEvent.press(radios[1]);
    expect(onChange).not.toHaveBeenCalled();
  });
});
