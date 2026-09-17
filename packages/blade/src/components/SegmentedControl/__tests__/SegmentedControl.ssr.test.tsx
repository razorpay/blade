import React from 'react';
import { SegmentedControl } from '../SegmentedControl';
import { SegmentedControlItem } from '../SegmentedControlItem';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<SegmentedControl /> (SSR)', () => {
  it('should render without hydration errors', () => {
    const { container } = renderWithSSR(
      <SegmentedControl defaultValue="daily" accessibilityLabel="Time period">
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
      </SegmentedControl>,
    );

    expect(container).toMatchSnapshot();
  });
});
