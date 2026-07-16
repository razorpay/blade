import React from 'react';
import { fireEvent, createEvent } from '@testing-library/react';
import { Slider } from '../Slider';
import renderWithTheme from '~utils/testing/renderWithTheme';

describe('<Slider />', () => {
  it('renders an accessible single slider with value and labels', () => {
    const { getByRole, getByText } = renderWithTheme(
      <Slider
        label="Transaction limit"
        defaultValue={50}
        min={0}
        max={100}
        showMinMax
        valueFormatter={(value) => `${value}%`}
      />,
    );

    const slider = getByRole('slider', { name: 'Transaction limit' });
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    expect(slider).toHaveAttribute('aria-valuetext', '50%');
    expect(getByText('0%')).toBeTruthy();
    expect(getByText('100%')).toBeTruthy();
  });

  it('supports uncontrolled value changes', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" defaultValue={25} onChange={onChange} />,
    );
    const slider = getByRole('slider', { name: 'Volume' });

    fireEvent.change(slider, { target: { value: '40' } });

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: undefined, value: 40 }));
    expect(slider).toHaveAttribute('aria-valuenow', '40');
  });

  it('supports controlled values without mutating the rendered value', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(<Slider label="Volume" value={25} onChange={onChange} />);
    const slider = getByRole('slider', { name: 'Volume' });

    fireEvent.change(slider, { target: { value: '40' } });

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: undefined, value: 40 }));
    expect(slider).toHaveAttribute('aria-valuenow', '25');
  });

  it('renders and updates a range without letting thumbs cross', () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Slider label="Amount" selectionType="range" defaultValue={[20, 80]} onChange={onChange} />,
    );
    const [minimum, maximum] = getAllByRole('slider');

    expect(minimum).toHaveAccessibleName('Amount minimum');
    expect(maximum).toHaveAccessibleName('Amount maximum');
    fireEvent.change(minimum, { target: { value: '90' } });
    fireEvent.change(maximum, { target: { value: '10' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: undefined, value: [80, 80] }),
    );
  });

  it('snaps values to decimal steps', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Scale" defaultValue={0} min={0} max={1} step={0.1} onChange={onChange} />,
    );

    fireEvent.change(getByRole('slider'), { target: { value: '0.26' } });

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: undefined, value: 0.3 }));
  });

  it('calls onChangeEnd after pointer and keyboard commits', () => {
    const onChangeEnd = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" defaultValue={40} onChangeEnd={onChangeEnd} />,
    );
    const slider = getByRole('slider');

    fireEvent.change(slider, { target: { value: '45' } });
    fireEvent.pointerDown(slider);
    fireEvent.pointerUp(slider);
    fireEvent.change(slider, { target: { value: '50' } });
    fireEvent.keyUp(slider, { key: 'ArrowRight' });

    expect(onChangeEnd).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ name: undefined, value: 45 }),
    );
    expect(onChangeEnd).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ name: undefined, value: 50 }),
    );
  });

  it('renders marks, thumb value, helper text, and custom header value', () => {
    const { getByText } = renderWithTheme(
      <Slider
        label="Risk"
        defaultValue={2}
        min={0}
        max={4}
        valueText="Balanced"
        showThumbValue
        showMarks
        marks={[
          { value: 0, label: 'Low' },
          { value: 4, label: 'High' },
        ]}
        helpText="Choose a risk level"
      />,
    );

    expect(getByText('Balanced')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('Low')).toBeTruthy();
    expect(getByText('High')).toBeTruthy();
    expect(getByText('Choose a risk level')).toBeTruthy();
  });

  it('connects an error message and disabled state to the native input', () => {
    const { getByRole, getByText } = renderWithTheme(
      <Slider
        label="Risk"
        defaultValue={20}
        validationState="error"
        errorText="Value is too low"
        isDisabled
      />,
    );
    const slider = getByRole('slider');

    expect(slider).toBeDisabled();
    expect(slider).toHaveAttribute('aria-invalid', 'true');
    expect(slider).toHaveAccessibleDescription('Value is too low');
    expect(getByText('Value is too low')).toBeTruthy();
  });

  it('exposes required semantics to assistive technology', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Transaction limit" defaultValue={50} isRequired />,
    );
    const slider = getByRole('slider');

    expect(slider).toHaveAttribute('aria-required', 'true');
  });

  it('accepts test and analytics attributes', () => {
    const { getByTestId } = renderWithTheme(
      <Slider accessibilityLabel="Volume" testID="volume-slider" data-analytics-name="volume" />,
    );

    expect(getByTestId('volume-slider')).toHaveAttribute('data-analytics-name', 'volume');
    expect(getByTestId('volume-slider')).toHaveAttribute('data-blade-component', 'slider');
  });

  it('throws for invalid bounds and steps', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() => renderWithTheme(<Slider label="Invalid" min={10} max={10} />)).toThrow(
      '`max` must be greater than `min`.',
    );
    expect(() => renderWithTheme(<Slider label="Invalid" step={0} />)).toThrow(
      '`step` must be greater than zero.',
    );
    consoleError.mockRestore();
  });

  it('supports Home, End, PageUp, and PageDown keyboard navigation', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" defaultValue={50} min={0} max={100} step={5} onChange={onChange} />,
    );
    const slider = getByRole('slider');

    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: undefined, value: 0 }),
    );

    fireEvent.keyDown(slider, { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: undefined, value: 100 }),
    );

    fireEvent.keyDown(slider, { key: 'Home' });
    fireEvent.keyDown(slider, { key: 'PageUp' });
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: undefined, value: 10 }),
    );

    fireEvent.keyDown(slider, { key: 'Home' });
    fireEvent.keyDown(slider, { key: 'PageDown' });
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ name: undefined, value: 0 }),
    );
  });

  it('supports controlled range slider values', () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <Slider
        label="Amount"
        selectionType="range"
        value={[30, 70]}
        min={0}
        max={100}
        onChange={onChange}
      />,
    );
    const [minimum, maximum] = getAllByRole('slider');

    expect(minimum).toHaveAttribute('aria-valuenow', '30');
    expect(maximum).toHaveAttribute('aria-valuenow', '70');

    fireEvent.change(minimum, { target: { value: '40' } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: undefined, value: [40, 70] }),
    );
  });

  it('supports track pointer click to jump to a position', () => {
    const onChange = jest.fn();
    const { container } = renderWithTheme(
      <Slider label="Volume" defaultValue={50} min={0} max={100} onChange={onChange} />,
    );
    // TrackArea is the parent of the range input (has onPointerDown handler)
    const rangeInput = container.querySelector('input[type="range"]');
    expect(rangeInput).toBeTruthy();
    const trackArea = rangeInput?.parentElement as HTMLElement;
    expect(trackArea).toBeTruthy();

    // trackRef is on TrackLine (first child of TrackArea)
    const trackLine = trackArea?.firstElementChild as HTMLElement;
    expect(trackLine).toBeTruthy();

    const rect = { left: 0, width: 100, top: 0, height: 44 } as DOMRect;
    jest.spyOn(trackLine, 'getBoundingClientRect').mockReturnValue(rect);

    const pointerEvent = createEvent.pointerDown(trackArea as Element, { clientX: 25 });
    Object.defineProperty(pointerEvent, 'clientX', { value: 25, configurable: true });
    fireEvent(trackArea as Element, pointerEvent);
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: undefined, value: 25 }));
  });

  it('formats range values using valueFormatter', () => {
    const { getAllByText } = renderWithTheme(
      <Slider
        label="Amount"
        selectionType="range"
        defaultValue={[20, 80]}
        min={0}
        max={100}
        showThumbValue
        valueFormatter={(value) => `$${value}`}
      />,
    );
    const thumbValues = getAllByText('$20');
    expect(thumbValues.length).toBeGreaterThan(0);
    expect(getAllByText('$80').length).toBeGreaterThan(0);
  });

  it('hides the header value when showValue is false', () => {
    const { queryByText } = renderWithTheme(
      <Slider label="Volume" defaultValue={50} showValue={false} />,
    );
    expect(queryByText('50')).toBeNull();
  });

  it('uses accessibilityLabel for aria-label when label is not provided', () => {
    const { getByRole } = renderWithTheme(
      <Slider accessibilityLabel="Screen reader label" defaultValue={50} />,
    );
    const slider = getByRole('slider', { name: 'Screen reader label' });
    expect(slider).toBeTruthy();
  });

  it('prevents interaction when disabled', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" defaultValue={50} isDisabled onChange={onChange} />,
    );
    const slider = getByRole('slider');

    expect(slider).toBeDisabled();
    fireEvent.change(slider, { target: { value: '60' } });
    expect(onChange).not.toHaveBeenCalled();
  });
});
