import React from 'react';
import userEvents from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { SliderInput } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { motion } from '~tokens/global';

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

  describe('name forwarding', () => {
    it('should forward name in onChange and onChangeEnd callbacks', async () => {
      const user = userEvents.setup();
      const onChange = jest.fn();
      const onChangeEnd = jest.fn();
      renderWithTheme(
        <SliderInput
          label="Volume"
          name="volume"
          defaultValue={50}
          onChange={onChange}
          onChangeEnd={onChangeEnd}
        />,
      );
      await user.tab();

      await user.keyboard('{ArrowRight}');
      expect(onChange).toHaveBeenLastCalledWith({ name: 'volume', value: 51 });
      expect(onChangeEnd).toHaveBeenCalledWith({ name: 'volume', value: 51 });
    });
  });

  describe('focus events', () => {
    it('should pass the value as a number to onFocus and onBlur', async () => {
      const user = userEvents.setup();
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      renderWithTheme(
        <SliderInput
          label="Volume"
          name="volume"
          defaultValue={30}
          onFocus={onFocus}
          onBlur={onBlur}
        />,
      );
      await user.tab();
      expect(onFocus).toHaveBeenCalledWith({ name: 'volume', value: 30 });
      await user.tab();
      expect(onBlur).toHaveBeenCalledWith({ name: 'volume', value: 30 });
    });
  });

  describe('pointer cancel', () => {
    it('should commit the last reached value instead of the cancelled pointer position', () => {
      const onChangeEnd = jest.fn();
      const { getByRole } = renderWithTheme(
        <SliderInput label="Volume" defaultValue={0} onChangeEnd={onChangeEnd} />,
      );
      const slider = getByRole('slider');
      // jsdom has no PointerEvent, so without this `button` and `clientX` never reach the handler.
      if (!window.PointerEvent) {
        ((window as unknown) as { PointerEvent: unknown }).PointerEvent = class extends MouseEvent {
          pointerId: number;
          constructor(type: string, init: PointerEventInit = {}) {
            super(type, init);
            this.pointerId = init.pointerId ?? 0;
          }
        };
      }
      const rectSpy = jest
        .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
        .mockReturnValue({ left: 0, width: 116, top: 0, height: 32 } as DOMRect);
      fireEvent.pointerDown(slider, { button: 0, clientX: 58, pointerId: 1 });
      fireEvent.pointerCancel(slider, { clientX: 0, pointerId: 1 });
      expect(onChangeEnd).toHaveBeenCalledTimes(1);
      expect(onChangeEnd).toHaveBeenCalledWith({ value: 50 });
      rectSpy.mockRestore();
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

  describe('where the ratio can interpolate', () => {
    const originalCSS = window.CSS;
    beforeEach(() => {
      // jsdom has no CSS.registerProperty, so the browsers that do are simulated here.
      Object.defineProperty(window, 'CSS', {
        configurable: true,
        writable: true,
        value: { ...originalCSS, registerProperty: jest.fn() },
      });
    });
    afterEach(() => {
      Object.defineProperty(window, 'CSS', {
        configurable: true,
        writable: true,
        value: originalCSS,
      });
    });

    it('should glide for a click but stop easing once the pointer really drags', async () => {
      const user = userEvents.setup();
      const { getByRole } = renderWithTheme(<SliderInput label="Volume" defaultValue={50} />);
      const slider = getByRole('slider');
      // The pointer handlers live on the control, which is the thumb's parent.
      const control = slider.parentElement as HTMLElement;
      // Whitespace is dropped on both sides because jsdom serialises `cubic-bezier()` without it.
      const withoutSpaces = (css: string): string => css.replace(/\s/g, '');
      // Movement is eased on the ratio the control owns, which the thumb and the fill both read.
      const movesWith = (easing: unknown): boolean =>
        withoutSpaces(getComputedStyle(control).transition).includes(
          `--slider-input-ratio80ms${withoutSpaces(String(easing))}`,
        );
      // The thumb does not ease its own position while the control is easing the ratio.
      expect(getComputedStyle(slider).transition).not.toContain('inset-inline-start');

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
      expect(movesWith(motion.easing.standard)).toBe(true);

      // Once the pointer moves the thumb has to sit under the finger, so the easing goes.
      fireEvent.pointerMove(control, { clientX: 40 });
      expect(getComputedStyle(control).transition).not.toContain('--slider-input-ratio');

      // Releasing restores the glide for the next click.
      fireEvent.pointerUp(control, { clientX: 40 });
      expect(movesWith(motion.easing.standard)).toBe(true);
    });

    it('should keep smoothing the drag between steps when markers are shown', async () => {
      const user = userEvents.setup();
      const { getByRole } = renderWithTheme(
        <SliderInput label="Volume" defaultValue={50} step={10} showMarkers={true} />,
      );
      const control = getByRole('slider').parentElement as HTMLElement;
      const withoutSpaces = (css: string): string => css.replace(/\s/g, '');
      const movesFor = (duration: number): boolean =>
        withoutSpaces(getComputedStyle(control).transition).includes(
          `--slider-input-ratio${duration}ms${withoutSpaces(String(motion.easing.standard))}`,
        );

      // The steps are coarse enough to hop visibly, so the drag glides between markers, a little
      // longer than a click so the hop reads as movement.
      await user.pointer({ keys: '[MouseLeft>]', target: control });
      fireEvent.pointerMove(control, { clientX: 40 });
      expect(movesFor(motion.duration.xquick)).toBe(true);

      fireEvent.pointerUp(control, { clientX: 40 });
      expect(movesFor(motion.duration['2xquick'])).toBe(true);
    });
  });

  describe('where the ratio cannot interpolate', () => {
    // jsdom has no CSS.registerProperty, which is exactly the unsupported case.
    const withoutSpaces = (css: string): string => css.replace(/\s/g, '');
    const easesOwn = (element: Element, property: string, duration: number): boolean =>
      withoutSpaces(getComputedStyle(element).transition).includes(
        `${property}${duration}ms${withoutSpaces(String(motion.easing.standard))}`,
      );

    it('should still place the thumb, fill and indicator from the ratio', () => {
      const { getByRole, container } = renderWithTheme(
        <SliderInput label="Volume" defaultValue={25} />,
      );
      const slider = getByRole('slider');
      const control = slider.parentElement as HTMLElement;

      // An unregistered custom property still substitutes, so positions stay correct.
      expect(control.style.getPropertyValue('--slider-input-ratio')).toBe('0.25');
      expect(slider.style.insetInlineStart).toContain('var(--slider-input-ratio)');
      expect(container.querySelector('[style*="clip-path"]')?.getAttribute('style')).toContain(
        'var(--slider-input-ratio)',
      );
    });

    it('should ease each element on its own instead, and still stop easing on a drag', async () => {
      const user = userEvents.setup();
      const { getByRole, container } = renderWithTheme(
        <SliderInput label="Volume" defaultValue={50} />,
      );
      const slider = getByRole('slider');
      const control = slider.parentElement as HTMLElement;
      const fill = container.querySelector('[style*="clip-path"]') as HTMLElement;
      const indicator = container.querySelector('[aria-hidden="true"]') as HTMLElement;

      // Nothing to ease on the control, since the ratio would only snap.
      expect(getComputedStyle(control).transition).not.toContain('--slider-input-ratio');
      expect(easesOwn(slider, 'inset-inline-start', motion.duration['2xquick'])).toBe(true);
      expect(easesOwn(fill, 'clip-path', motion.duration['2xquick'])).toBe(true);
      expect(easesOwn(indicator, 'inset-inline-start', motion.duration['2xquick'])).toBe(true);

      await user.pointer({ keys: '[MouseLeft>]', target: control });
      fireEvent.pointerMove(control, { clientX: 40 });
      expect(getComputedStyle(slider).transition).not.toContain('inset-inline-start');
      expect(getComputedStyle(fill).transition).not.toContain('clip-path');

      fireEvent.pointerUp(control, { clientX: 40 });
      expect(easesOwn(slider, 'inset-inline-start', motion.duration['2xquick'])).toBe(true);
    });

    it('should keep smoothing the drag between markers on each element', async () => {
      const user = userEvents.setup();
      const { getByRole, container } = renderWithTheme(
        <SliderInput label="Volume" defaultValue={50} step={10} showMarkers={true} />,
      );
      const slider = getByRole('slider');
      const control = slider.parentElement as HTMLElement;
      const fill = container.querySelectorAll('[style*="clip-path"]')[0] as HTMLElement;

      await user.pointer({ keys: '[MouseLeft>]', target: control });
      fireEvent.pointerMove(control, { clientX: 40 });
      expect(easesOwn(slider, 'inset-inline-start', motion.duration.xquick)).toBe(true);
      expect(easesOwn(fill, 'clip-path', motion.duration.xquick)).toBe(true);
    });
  });

  it('should hug the value indicator to its text', () => {
    // Figma puts a 13px wide "50" in a 21 x 17 box, which is 2px and 4px of padding. With no
    // scale and no hint, the indicator is the only aria-hidden node in the tree.
    const { container } = renderWithTheme(<SliderInput label="Volume" defaultValue={50} />);
    const indicator = container.querySelector('[aria-hidden="true"]');

    // The number rolls, so every digit is present in each column. The value itself is stated
    // once, on the node that assistive technology reads.
    expect(indicator?.querySelector('[data-blade-component="visually-hidden"]')).toHaveTextContent(
      '50',
    );
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
