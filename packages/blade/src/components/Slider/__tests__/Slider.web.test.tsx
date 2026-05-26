/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { Slider } from '../Slider';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<Slider />', () => {
  it('should render slider with label', () => {
    const { container, getByRole } = renderWithTheme(<Slider label="Volume" defaultValue={50} />);
    expect(container).toMatchSnapshot();
    expect(getByRole('slider')).toBeInTheDocument();
  });

  it('should render slider without label using accessibilityLabel', () => {
    const { getByRole } = renderWithTheme(
      <Slider accessibilityLabel="Volume control" defaultValue={50} />,
    );
    expect(getByRole('slider', { name: 'Volume control' })).toBeInTheDocument();
  });

  it('should set disabled state with isDisabled', () => {
    const { getByRole } = renderWithTheme(<Slider label="Volume" defaultValue={50} isDisabled />);
    expect(getByRole('slider')).toBeDisabled();
  });

  it('should render with defaultValue', () => {
    const { getByRole } = renderWithTheme(<Slider label="Volume" defaultValue={30} />);
    expect(getByRole('slider')).toHaveValue('30');
  });

  it('should use min as default when defaultValue is not provided', () => {
    const { getByRole } = renderWithTheme(<Slider label="Volume" min={10} max={100} />);
    expect(getByRole('slider')).toHaveValue('10');
  });

  it('should render with min and max', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" min={20} max={80} defaultValue={50} />,
    );
    const slider = getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '20');
    expect(slider).toHaveAttribute('aria-valuemax', '80');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  it('should call onChange when value changes', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" defaultValue={50} onChange={onChange} name="volume" />,
    );
    const slider = getByRole('slider');
    fireEvent.change(slider, { target: { value: '60' } });
    expect(onChange).toHaveBeenCalled();
    const callArg = onChange.mock.calls[0][0];
    expect(callArg).toHaveProperty('value', 60);
    expect(callArg).toHaveProperty('name', 'volume');
  });

  it('should render with controlled value', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" value={75} onChange={jest.fn()} />,
    );
    expect(getByRole('slider')).toHaveValue('75');
  });

  it('should render help text', () => {
    const { getByText } = renderWithTheme(
      <Slider label="Volume" defaultValue={50} helpText="Adjust the volume level" />,
    );
    expect(getByText('Adjust the volume level')).toBeInTheDocument();
  });

  it('should render error text when validationState is error', () => {
    const { getByText } = renderWithTheme(
      <Slider
        label="Volume"
        defaultValue={0}
        validationState="error"
        errorText="Value is required"
      />,
    );
    expect(getByText('Value is required')).toBeInTheDocument();
  });

  it('should render success text when validationState is success', () => {
    const { getByText } = renderWithTheme(
      <Slider
        label="Discount"
        defaultValue={25}
        validationState="success"
        successText="Looks good!"
      />,
    );
    expect(getByText('Looks good!')).toBeInTheDocument();
  });

  it('should show current value by default', () => {
    const { getByText } = renderWithTheme(<Slider label="Volume" defaultValue={42} />);
    expect(getByText('42')).toBeInTheDocument();
  });

  it('should hide value when showValue is false', () => {
    const { queryByText } = renderWithTheme(
      <Slider label="Volume" defaultValue={42} showValue={false} />,
    );
    expect(queryByText('42')).not.toBeInTheDocument();
  });

  it('should respect step attribute', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Rating" min={1} max={5} step={1} defaultValue={3} />,
    );
    expect(getByRole('slider')).toHaveAttribute('step', '1');
  });

  it('should pass accessibility checks', async () => {
    const { container } = renderWithTheme(
      <Slider label="Volume" defaultValue={50} helpText="Adjust the volume" />,
    );
    await assertAccessible(container);
  });

  it('should clamp value to min/max range for controlled usage', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" value={150} max={100} onChange={jest.fn()} />,
    );
    expect(Number(getByRole('slider').getAttribute('aria-valuenow'))).toBeLessThanOrEqual(100);
  });
});
