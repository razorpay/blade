import React from 'react';
import userEvents from '@testing-library/user-event';
import { BaseAnimatedValue } from '../BaseAnimatedValue.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

/**
 * A rolling number carries every digit in each column, so its text reads `01234567890`. The one
 * node that states the actual value is the hidden one, which is what a screen reader gets and
 * what these assertions go by.
 */
const readValue = (container: HTMLElement): string =>
  container.querySelector('[data-blade-component="visually-hidden"]')?.textContent ?? '';

describe('<BaseAnimatedValue />', () => {
  it('should render the value when given no children', () => {
    const { container } = renderWithTheme(<BaseAnimatedValue value={42} />);
    expect(readValue(container)).toBe('42');
  });

  it('should render children in place of the value', () => {
    // The raw value drives the roll while the formatted string is what is shown, so a unit or
    // a currency rides along as literals between the digit columns.
    const { container } = renderWithTheme(
      <BaseAnimatedValue value={1200}>₹1,200</BaseAnimatedValue>,
    );
    expect(readValue(container)).toBe('₹1,200');
  });

  /**
   * The change is driven through state rather than RTL's `rerender`, which re-renders without
   * the theme provider that `renderWithTheme` wrapped the first render in.
   */
  const Swapper = ({
    from,
    to,
  }: {
    from: string | number;
    to: string | number;
  }): React.ReactElement => {
    const [value, setValue] = React.useState<string | number>(from);
    return (
      <>
        <button type="button" onClick={() => setValue(to)}>
          swap
        </button>
        <BaseAnimatedValue value={value} />
      </>
    );
  };

  it('should show the new value after a change', async () => {
    const user = userEvents.setup();
    const { container, getByText } = renderWithTheme(<Swapper from={1} to={2} />);
    expect(readValue(container)).toBe('1');

    await user.click(getByText('swap'));
    expect(readValue(container)).toBe('2');
  });

  it('should swap the whole value when there are no digits to roll', async () => {
    // Words have no places to drive columns from, so they cross-fade as a whole instead.
    const user = userEvents.setup();
    const { getByText } = renderWithTheme(<Swapper from="draft" to="published" />);
    expect(getByText('draft')).toBeInTheDocument();

    await user.click(getByText('swap'));
    expect(getByText('published')).toBeInTheDocument();
  });

  it('should write rapid changes to a swapped value in place rather than stacking copies', async () => {
    const user = userEvents.setup();
    const Rapid = (): React.ReactElement => {
      const [value, setValue] = React.useState('a');
      return (
        <>
          {/* One click, many changes, exactly as a drag produces. */}
          <button type="button" onClick={() => ['b', 'c', 'd', 'e'].forEach((v) => setValue(v))}>
            churn
          </button>
          <BaseAnimatedValue value={value} testID="rapid" />
        </>
      );
    };

    const { getByText, getByTestId } = renderWithTheme(<Rapid />);
    await user.click(getByText('churn'));

    // A swap only reads when there is time to read it, so changes arriving mid-swap replace the
    // content instead of queueing another copy behind it.
    expect(getByTestId('rapid').children).toHaveLength(1);
    expect(getByText('e')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = renderWithTheme(<BaseAnimatedValue value={7} />);
    expect(container).toMatchSnapshot();
  });
});
