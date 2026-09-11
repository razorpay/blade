import React from 'react';
import userEvents from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { SliderInput } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<SliderInput />', () => {
  it('should render a slider', () => {
    const { container } = renderWithTheme(<SliderInput label="Volume" />);
    expect(container).toMatchSnapshot();
  });

  it('should render with markers, a scale and a left positioned label', () => {
    const { container } = renderWithTheme(
      <SliderInput
        label="Corner Radius"
        labelPosition="left"
        min={0}
        max={40}
        step={8}
        showMarkers
        showScale
        defaultValue={16}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should expose the range and the current value to assistive technology', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Volume" min={10} max={50} defaultValue={20} />,
    );
    const slider = getByRole('slider');

    expect(slider).toHaveAttribute('aria-valuemin', '10');
    expect(slider).toHaveAttribute('aria-valuemax', '50');
    expect(slider).toHaveAttribute('aria-valuenow', '20');
    expect(slider).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('should report the snapped value, not the value it was given', () => {
    // 37 is not a multiple of 8, so the thumb stands on 40 and must announce 40.
    const { getByRole } = renderWithTheme(
      <SliderInput label="Corner Radius" min={0} max={40} step={8} value={37} />,
    );
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '40');
  });

  it('should run aria-valuetext through formatValue', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput
        label="Price"
        min={0}
        max={100}
        defaultValue={25}
        formatValue={(value) => `₹${value}`}
      />,
    );
    expect(getByRole('slider')).toHaveAttribute('aria-valuetext', '₹25');
  });

  it('should take its accessible name from the visible label', () => {
    const { getByRole } = renderWithTheme(<SliderInput label="Volume" />);
    expect(getByRole('slider')).toHaveAccessibleName('Volume');
  });

  it('should fall back to accessibilityLabel when there is no visible label', () => {
    const { getByRole } = renderWithTheme(<SliderInput accessibilityLabel="Volume level" />);
    expect(getByRole('slider')).toHaveAccessibleName('Volume level');
  });

  it('should describe the slider with the error text when validation fails', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Volume" validationState="error" errorText="Too loud" />,
    );
    expect(getByRole('slider')).toHaveAccessibleDescription('Too loud');
  });

  it('should describe the slider with the help text otherwise', () => {
    const { getByRole } = renderWithTheme(
      <SliderInput label="Volume" helpText="Adjust the output level" />,
    );
    expect(getByRole('slider')).toHaveAccessibleDescription('Adjust the output level');
  });

  describe('keyboard', () => {
    it('should move by one step with the arrow keys', async () => {
      const user = userEvents.setup();
      const onChange = jest.fn();
      const { getByRole } = renderWithTheme(
        <SliderInput label="Volume" step={5} defaultValue={50} onChange={onChange} />,
      );
      const slider = getByRole('slider');
      await user.tab();
      expect(slider).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(onChange).toHaveBeenLastCalledWith({ value: 55 });

      await user.keyboard('{ArrowLeft}{ArrowLeft}');
      expect(onChange).toHaveBeenLastCalledWith({ value: 45 });

      await user.keyboard('{ArrowUp}');
      expect(onChange).toHaveBeenLastCalledWith({ value: 50 });
    });

    it('should jump to the bounds with Home and End, and coarsely with Page keys', async () => {
      const user = userEvents.setup();
      const onChange = jest.fn();
      renderWithTheme(
        <SliderInput label="Volume" min={0} max={100} defaultValue={50} onChange={onChange} />,
      );
      await user.tab();

      await user.keyboard('{Home}');
      expect(onChange).toHaveBeenLastCalledWith({ value: 0 });

      await user.keyboard('{End}');
      expect(onChange).toHaveBeenLastCalledWith({ value: 100 });

      // A page step is a tenth of the range here, so it lands on 90.
      await user.keyboard('{PageDown}');
      expect(onChange).toHaveBeenLastCalledWith({ value: 90 });
    });

    it('should not step past the bounds', async () => {
      const user = userEvents.setup();
      const { getByRole } = renderWithTheme(
        <SliderInput label="Volume" min={0} max={10} defaultValue={10} />,
      );
      const slider = getByRole('slider');
      await user.tab();

      await user.keyboard('{ArrowRight}{ArrowRight}');
      expect(slider).toHaveAttribute('aria-valuenow', '10');
    });
  });

  describe('onChangeEnd', () => {
    it('should commit once per keyboard interaction rather than per step', async () => {
      const user = userEvents.setup();
      const onChange = jest.fn();
      const onChangeEnd = jest.fn();
      renderWithTheme(
        <SliderInput
          label="Volume"
          defaultValue={50}
          onChange={onChange}
          onChangeEnd={onChangeEnd}
        />,
      );
      await user.tab();

      await user.keyboard('{ArrowRight}');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChangeEnd).toHaveBeenCalledTimes(1);
      expect(onChangeEnd).toHaveBeenCalledWith({ value: 51 });
    });

    it('should stay silent when an interaction leaves the value unchanged', async () => {
      const user = userEvents.setup();
      const onChangeEnd = jest.fn();
      renderWithTheme(
        <SliderInput label="Volume" min={0} max={10} defaultValue={0} onChangeEnd={onChangeEnd} />,
      );
      await user.tab();

      // Already at min, so this is a no-op and must not trigger expensive work.
      await user.keyboard('{Home}');
      expect(onChangeEnd).not.toHaveBeenCalled();
    });
  });

  describe('controlled and uncontrolled', () => {
    it('should not move on its own when controlled', async () => {
      const user = userEvents.setup();
      const onChange = jest.fn();
      const { getByRole } = renderWithTheme(
        <SliderInput label="Volume" value={30} onChange={onChange} />,
      );
      const slider = getByRole('slider');
      await user.tab();

      await user.keyboard('{ArrowRight}');

      expect(onChange).toHaveBeenCalledWith({ value: 31 });
      expect(slider).toHaveAttribute('aria-valuenow', '30');
    });

    it('should move on its own when uncontrolled', async () => {
      const user = userEvents.setup();
      const { getByRole } = renderWithTheme(<SliderInput label="Volume" defaultValue={30} />);
      const slider = getByRole('slider');
      await user.tab();

      await user.keyboard('{ArrowRight}');
      expect(slider).toHaveAttribute('aria-valuenow', '31');
    });

    it('should start at min when given no value', () => {
      const { getByRole } = renderWithTheme(<SliderInput label="Volume" min={7} max={20} />);
      expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '7');
    });
  });

  describe('disabled', () => {
    it('should not be focusable or respond to the keyboard', async () => {
      const user = userEvents.setup();
      const onChange = jest.fn();
      const { getByRole } = renderWithTheme(
        <SliderInput label="Volume" defaultValue={50} isDisabled onChange={onChange} />,
      );
      const slider = getByRole('slider');

      expect(slider).toHaveAttribute('aria-disabled', 'true');
      expect(slider).toHaveAttribute('tabindex', '-1');

      await user.tab();
      expect(slider).not.toHaveFocus();

      await user.keyboard('{ArrowRight}');

      expect(onChange).not.toHaveBeenCalled();
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });
  });

  it('should submit the value through a hidden field when given a name', () => {
    const { container } = renderWithTheme(
      <SliderInput label="Volume" name="volume" defaultValue={42} />,
    );
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).toHaveAttribute('name', 'volume');
    expect(hidden).toHaveValue('42');
  });

  it('should render only the bounds when showScaleValues is false', () => {
    const { queryByText, getByText } = renderWithTheme(
      // The value indicator is off so the only rendered text is the scale itself.
      <SliderInput
        label="Volume"
        min={0}
        max={100}
        step={25}
        showScale
        showScaleValues={false}
        showValueIndicator={false}
      />,
    );
    expect(getByText('0')).toBeInTheDocument();
    expect(getByText('100')).toBeInTheDocument();
    expect(queryByText('50')).not.toBeInTheDocument();
  });

  it('should focus the thumb on click so the keyboard works straight after a drag', async () => {
    const user = userEvents.setup();
    const { getByRole } = renderWithTheme(<SliderInput label="Volume" defaultValue={50} />);
    const slider = getByRole('slider');

    // The pointer handler calls preventDefault to suppress text selection, which also
    // suppresses the browser's own focus, so the component has to move focus itself.
    await user.click(slider);
    expect(slider).toHaveFocus();

    // Where the click itself lands is not asserted: jsdom reports a zero-sized rect, so the
    // pointer maths has no width to work with. What matters is that the keyboard now drives it.
    const afterClick = Number(slider.getAttribute('aria-valuenow'));
    await user.keyboard('{ArrowRight}');
    expect(Number(slider.getAttribute('aria-valuenow'))).toBe(afterClick + 1);
  });

  it('should glide for a click but stop easing once the pointer really drags', async () => {
    const user = userEvents.setup();
    const { getByRole } = renderWithTheme(<SliderInput label="Volume" defaultValue={50} />);
    const slider = getByRole('slider');
    // The pointer handlers live on the control, which is the thumb's parent.
    const control = slider.parentElement as HTMLElement;
    const movesWithEasing = (): boolean =>
      getComputedStyle(slider).transition.includes('inset-inline-start');

    // A press on its own is a click, so the thumb travels to where it landed rather than
    // teleporting there.
    /*
     * The press goes through user-event and the move through fireEvent, because neither can
     * do both here: fireEvent cannot produce a pointerdown carrying `button`, which the
     * handler requires, and user-event does not put coordinates on the event.
     *
     * That also means the 3px slop cannot be exercised in jsdom, since the press arrives
     * without a clientX to measure from. It is covered in a real browser instead.
     */
    await user.pointer({ keys: '[MouseLeft>]', target: control });
    expect(movesWithEasing()).toBe(true);

    // Once the pointer moves the thumb has to sit under the finger, so the easing goes.
    fireEvent.pointerMove(control, { clientX: 40 });
    expect(movesWithEasing()).toBe(false);

    // Releasing restores it for the next click.
    fireEvent.pointerUp(control, { clientX: 40 });
    expect(movesWithEasing()).toBe(true);
  });

  it('should hug the value indicator to its text', () => {
    // Figma puts a 13px wide "50" in a 21 x 17 box, which is 2px and 4px of padding. With no
    // scale and no hint, the indicator is the only aria-hidden node in the tree.
    const { container } = renderWithTheme(<SliderInput label="Volume" defaultValue={50} />);
    const indicator = container.querySelector('[aria-hidden="true"]');

    expect(indicator).toHaveTextContent('50');
    const { paddingTop, paddingRight, paddingBottom, paddingLeft } = getComputedStyle(
      indicator as Element,
    );
    expect([paddingTop, paddingBottom]).toEqual(['2px', '2px']); // spacing.1
    expect([paddingLeft, paddingRight]).toEqual(['4px', '4px']); // spacing.2
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<SliderInput label="Volume" testID="volume-slider" />);
    expect(getByTestId('volume-slider')).toBeInTheDocument();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
      <SliderInput label="Volume" helpText="Adjust the output level" showMarkers showScale />,
    );
    await assertAccessible(container);
  });
});
