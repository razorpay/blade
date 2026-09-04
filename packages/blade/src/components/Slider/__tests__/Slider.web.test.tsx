import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { Slider } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Slider />', () => {
  it('should render with default props', () => {
    const { getByRole, getByText } = renderWithTheme(<Slider label="Test Slider" />);
    expect(getByRole('slider')).toBeTruthy();
    expect(getByText('Test Slider')).toBeTruthy();
  });

  it('should call onChange when value changes via keyboard', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Test" value={50} onChange={onChange} min={0} max={100} step={1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ value: 51 });
  });

  it('should respect min/max constraints via keyboard', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Test" value={100} onChange={onChange} min={0} max={100} step={1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should jump to min/max on Home/End keys', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Test" value={50} onChange={onChange} min={0} max={100} step={1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith({ value: 0 });
    fireEvent.keyDown(slider, { key: 'End' });
    expect(onChange).toHaveBeenCalledWith({ value: 100 });
  });

  it('should render in disabled state', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Test" value={50} onChange={jest.fn()} isDisabled />,
    );
    expect(getByRole('slider')).toHaveAttribute('aria-disabled', 'true');
  });

  it('should set correct ARIA attributes', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Radius" value={12} onChange={jest.fn()} min={0} max={24} suffix="px" />,
    );
    const slider = getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '24');
    expect(slider).toHaveAttribute('aria-valuenow', '12');
    expect(slider).toHaveAttribute('aria-valuetext', '12 px');
  });

  it('should call onChange with both name and value', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Test" value={50} name="mySlider" onChange={onChange} step={1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ name: 'mySlider', value: 51 });
  });

  it('should clamp an unset initial value up to min (not start at 0)', () => {
    const { getByRole } = renderWithTheme(<Slider label="Test" min={10} max={20} />);
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '10');
  });

  it('should clamp an out-of-range defaultValue into [min, max]', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Test" defaultValue={500} min={0} max={100} />,
    );
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '100');
  });

  it('should work as uncontrolled component', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Test" defaultValue={25} min={0} max={100} step={1} />,
    );
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '25');
  });

  it('should jump by step * 10 on Shift+Arrow (large step)', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Test" value={50} onChange={onChange} min={0} max={100} step={1} />,
    );
    fireEvent.keyDown(getByRole('slider'), { key: 'ArrowRight', shiftKey: true });
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 60 });
  });

  it('should keep max reachable when the range is not a multiple of step', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Test" defaultValue={6} min={0} max={10} step={3} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider).toHaveAttribute('aria-valuenow', '10');
  });

  it('should snap steps anchored at min, not at zero', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Test" defaultValue={1} min={1} max={9} step={2} onChange={onChange} />,
    );
    fireEvent.keyDown(getByRole('slider'), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ name: undefined, value: 3 });
  });

  it('should not leak floating-point artifacts for fractional steps', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Test" defaultValue={0.2} min={0} max={1} step={0.1} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider).toHaveAttribute('aria-valuenow', '0.3');
  });

  it('should snap to step values', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Test" value={10} onChange={onChange} min={0} max={100} step={5} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ value: 15 });
  });

  it('should call onChangeStart on keydown and onChangeEnd on keyup', () => {
    const onChangeStart = jest.fn();
    const onChangeEnd = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider
        label="Test"
        defaultValue={50}
        onChangeStart={onChangeStart}
        onChangeEnd={onChangeEnd}
        min={0}
        max={100}
        step={1}
      />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChangeStart).toHaveBeenCalledWith({ value: 50 });
    expect(onChangeEnd).not.toHaveBeenCalled();
    fireEvent.keyUp(slider, { key: 'ArrowRight' });
    expect(onChangeEnd).toHaveBeenCalledWith({ value: 51 });
  });

  it('should not call onChangeStart again while a key is held down', () => {
    const onChangeStart = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider
        label="Test"
        defaultValue={50}
        onChangeStart={onChangeStart}
        min={0}
        max={100}
        step={1}
      />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChangeStart).toHaveBeenCalledTimes(1);
  });

  it('should not crash or produce NaN when step is 0', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Test" value={50} onChange={onChange} min={0} max={100} step={0} />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith({ value: 51 });
  });

  it('should fire onChangeEnd and reset key-active state if focus leaves mid-keypress', () => {
    const onChangeStart = jest.fn();
    const onChangeEnd = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider
        label="Test"
        defaultValue={50}
        onChangeStart={onChangeStart}
        onChangeEnd={onChangeEnd}
        min={0}
        max={100}
        step={1}
      />,
    );
    const slider = getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.blur(slider);
    expect(onChangeEnd).toHaveBeenCalledWith({ value: 51 });

    fireEvent.focus(slider);
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChangeStart).toHaveBeenCalledTimes(2);
  });

  it('should show a value tooltip with the suffix on thumb hover', () => {
    const { getByRole, queryByRole, getByText } = renderWithTheme(
      <Slider label="Test" value={12} onChange={jest.fn()} min={0} max={24} suffix="px" />,
    );
    // Slider is a pure slider — it renders no text field
    expect(queryByRole('textbox')).toBeNull();
    fireEvent.mouseEnter(getByRole('slider'));
    expect(getByText('12 px')).toBeInTheDocument();
  });

  it('should not show the value tooltip when showTooltip is false', () => {
    const { getByRole, queryByText } = renderWithTheme(
      <Slider label="Test" value={12} onChange={jest.fn()} min={0} max={24} showTooltip={false} />,
    );
    fireEvent.mouseEnter(getByRole('slider'));
    fireEvent.focus(getByRole('slider'));
    expect(queryByText('12')).toBeNull();
  });

  it('should show the value tooltip on keyboard focus and update it live', () => {
    const { getByRole, getByText } = renderWithTheme(
      <Slider label="Test" defaultValue={12} min={0} max={24} />,
    );
    const slider = getByRole('slider');
    fireEvent.focus(slider);
    expect(getByText('12')).toBeInTheDocument();
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(getByText('13')).toBeInTheDocument();
  });

  it('should render the track as step segments when showSteps is true', () => {
    // jest-styled-components serializes the class CSS into the snapshot, so the
    // repeating-linear-gradient (one 10% cycle per step, 1px gap) is asserted there.
    const { container } = renderWithTheme(
      <Slider label="Test" defaultValue={50} min={0} max={100} step={10} showSteps />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should auto-hide step segments when steps are too dense for the track width', () => {
    // jsdom has no ResizeObserver — install a mock that lets the test control
    // the measured track width, mirroring what a real browser reports.
    let resizeCallback: (entries: { contentRect: { width: number } }[]) => void = () => undefined;
    const observe = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).ResizeObserver = class {
      constructor(callback: typeof resizeCallback) {
        resizeCallback = callback;
      }
      observe = observe;
      disconnect = jest.fn();
      unobserve = jest.fn();
    };

    const { getByRole } = renderWithTheme(
      <Slider label="Test" defaultValue={50} min={0} max={100} step={1} showSteps />,
    );
    const track = getByRole('slider').parentElement?.firstElementChild as HTMLElement;
    expect(observe).toHaveBeenCalled();
    // Reads the CSS declarations styled-components generated for the track's
    // current hash class (the gradient lives in class CSS, not inline style).
    const trackCss = (): string => {
      const hashClass = [...track.classList].find((c) => !c.includes('StyledTrackBackground'));
      const css = [...document.querySelectorAll('style')]
        .map((styleTag) => styleTag.textContent ?? '')
        .join('\n');
      const start = css.indexOf(`.${hashClass}{`);
      return start === -1 ? '' : css.slice(start, css.indexOf('}', start));
    };

    // 100 steps on a 300px track → 3px per block, below the 8px minimum → hidden
    act(() => resizeCallback([{ contentRect: { width: 300 } }]));
    expect(trackCss()).not.toContain('repeating-linear-gradient');
    expect(trackCss()).toContain('background-color');

    // Same slider on a 1600px track → 16px per block → segments shown
    act(() => resizeCallback([{ contentRect: { width: 1600 } }]));
    expect(trackCss()).toContain('repeating-linear-gradient');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).ResizeObserver;
  });

  it('should warn in dev when step does not divide the range evenly and showSteps is on', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    renderWithTheme(<Slider label="Test" defaultValue={0} min={0} max={10} step={3} showSteps />);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('does not divide the `min`–`max` range'),
    );

    consoleWarnSpy.mockClear();
    // Evenly divisible range → no warning (fractional steps included: 0–1 by 0.1)
    renderWithTheme(<Slider label="Test" defaultValue={0} min={0} max={1} step={0.1} showSteps />);
    expect(console.warn).not.toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });
});
