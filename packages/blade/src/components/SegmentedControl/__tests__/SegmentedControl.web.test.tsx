import userEvents from '@testing-library/user-event';
import React from 'react';
import { SegmentedControl } from '../SegmentedControl';
import { SegmentedControlItem } from '../SegmentedControlItem';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SegmentedControl />', () => {
  it('should render with default props', () => {
    const { container, getByRole, getAllByRole } = renderWithTheme(
      <SegmentedControl defaultValue="daily">
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
      </SegmentedControl>,
    );

    expect(getByRole('radiogroup')).toBeInTheDocument();
    expect(getAllByRole('radio')).toHaveLength(3);
    expect(container).toMatchSnapshot();
  });

  it('should select defaultValue on mount', () => {
    const { getByRole } = renderWithTheme(
      <SegmentedControl defaultValue="weekly">
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
      </SegmentedControl>,
    );

    expect(getByRole('radio', { name: /weekly/i })).toHaveAttribute('aria-checked', 'true');
    expect(getByRole('radio', { name: /daily/i })).toHaveAttribute('aria-checked', 'false');
  });

  it('should handle selection change (uncontrolled)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();

    const { getByRole } = renderWithTheme(
      <SegmentedControl defaultValue="daily" onChange={onChange}>
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
      </SegmentedControl>,
    );

    await user.click(getByRole('radio', { name: /weekly/i }));
    expect(onChange).toHaveBeenCalledWith('weekly');
    expect(getByRole('radio', { name: /weekly/i })).toHaveAttribute('aria-checked', 'true');
    expect(getByRole('radio', { name: /daily/i })).toHaveAttribute('aria-checked', 'false');
  });

  it('should work in controlled mode', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();

    const ControlledExample = (): React.ReactElement => {
      const [value, setValue] = React.useState('daily');
      return (
        <SegmentedControl
          value={value}
          onChange={(v) => {
            setValue(v);
            onChange(v);
          }}
        >
          <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
          <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
        </SegmentedControl>
      );
    };

    const { getByRole } = renderWithTheme(<ControlledExample />);

    expect(getByRole('radio', { name: /daily/i })).toHaveAttribute('aria-checked', 'true');

    await user.click(getByRole('radio', { name: /weekly/i }));
    expect(onChange).toHaveBeenCalledWith('weekly');
    expect(getByRole('radio', { name: /weekly/i })).toHaveAttribute('aria-checked', 'true');
  });

  it('should disable all items when isDisabled is true', () => {
    const { getAllByRole } = renderWithTheme(
      <SegmentedControl isDisabled defaultValue="daily">
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      </SegmentedControl>,
    );

    const radios = getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).toBeDisabled();
    });
  });

  it('should disable individual item', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();

    const { getByRole } = renderWithTheme(
      <SegmentedControl defaultValue="daily" onChange={onChange}>
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly" isDisabled>
          Weekly
        </SegmentedControlItem>
      </SegmentedControl>,
    );

    expect(getByRole('radio', { name: /weekly/i })).toBeDisabled();
    await user.click(getByRole('radio', { name: /weekly/i }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should render with different sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;

    sizes.forEach((size) => {
      const { getByRole, unmount } = renderWithTheme(
        <SegmentedControl size={size} defaultValue="a">
          <SegmentedControlItem value="a">A</SegmentedControlItem>
          <SegmentedControlItem value="b">B</SegmentedControlItem>
        </SegmentedControl>,
      );

      expect(getByRole('radiogroup')).toBeInTheDocument();
      unmount();
    });
  });

  it('should always render full width', () => {
    const { getByRole } = renderWithTheme(
      <SegmentedControl defaultValue="a">
        <SegmentedControlItem value="a">A</SegmentedControlItem>
        <SegmentedControlItem value="b">B</SegmentedControlItem>
      </SegmentedControl>,
    );

    expect(getByRole('radiogroup')).toHaveStyle({ width: '100%' });
  });

  it('should have correct accessibility attributes', () => {
    const { getByRole } = renderWithTheme(
      <SegmentedControl name="frequency" defaultValue="daily">
        <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
        <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      </SegmentedControl>,
    );

    expect(getByRole('radiogroup')).toHaveAttribute('aria-label', 'frequency');
  });
});
