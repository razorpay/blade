import React from 'react';
import userEvents from '@testing-library/user-event';
import { BaseAnimatedValue } from '../BaseAnimatedValue.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BaseAnimatedValue />', () => {
  it('should render the value when given no children', () => {
    const { getByText } = renderWithTheme(<BaseAnimatedValue value={42} />);
    expect(getByText('42')).toBeInTheDocument();
  });

  it('should render children in place of the value', () => {
    // The raw value drives the direction while the formatted string is what is shown, so a
    // unit or a currency does not stop the swap from moving the right way.
    const { getByText, queryByText } = renderWithTheme(
      <BaseAnimatedValue value={1200}>₹1,200</BaseAnimatedValue>,
    );
    expect(getByText('₹1,200')).toBeInTheDocument();
    expect(queryByText('1200')).not.toBeInTheDocument();
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
    const { getByText } = renderWithTheme(<Swapper from={1} to={2} />);
    expect(getByText('1')).toBeInTheDocument();

    await user.click(getByText('swap'));
    expect(getByText('2')).toBeInTheDocument();
  });

  it('should take non-numeric content without complaint', async () => {
    // There is no meaningful "up" between two words, so this cross-fades rather than
    // travelling. It still has to render.
    const user = userEvents.setup();
    const { getByText } = renderWithTheme(<Swapper from="draft" to="published" />);
    expect(getByText('draft')).toBeInTheDocument();

    await user.click(getByText('swap'));
    expect(getByText('published')).toBeInTheDocument();
  });

  it('should write rapid changes in place rather than stacking animated copies', async () => {
    const user = userEvents.setup();
    const Rapid = (): React.ReactElement => {
      const [value, setValue] = React.useState(0);
      return (
        <>
          {/* One click, many changes, exactly as a drag produces. */}
          <button type="button" onClick={() => [1, 2, 3, 4, 5].forEach((v) => setValue(v))}>
            churn
          </button>
          <BaseAnimatedValue value={value} testID="rapid" />
        </>
      );
    };

    const { getByText, getByTestId } = renderWithTheme(<Rapid />);
    await user.click(getByText('churn'));

    // A roll only reads when there is time to read it, so changes arriving mid-swap replace
    // the content instead of queueing another copy behind it.
    expect(getByTestId('rapid').children).toHaveLength(1);
    expect(getByText('5')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = renderWithTheme(<BaseAnimatedValue value={7} />);
    expect(container).toMatchSnapshot();
  });
});
