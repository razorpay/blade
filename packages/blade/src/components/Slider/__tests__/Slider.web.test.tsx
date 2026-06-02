import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { Slider } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Slider />', () => {
  it('renders with label', () => {
    const { getByRole, getByText } = renderWithTheme(<Slider label="Volume" />);
    expect(getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
    expect(getByText('Volume')).toBeInTheDocument();
  });

  it('renders with accessibilityLabel when label is absent', () => {
    const { getByRole } = renderWithTheme(
      <Slider accessibilityLabel="Screen brightness" />,
    );
    expect(getByRole('slider', { name: 'Screen brightness' })).toBeInTheDocument();
  });

  it('throws in dev if neither label nor accessibilityLabel is provided', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderWithTheme(<Slider />)).toThrow();
    consoleError.mockRestore();
  });

  it('sets default min, max, step attributes', () => {
    const { getByRole } = renderWithTheme(<Slider label="Volume" />);
    const slider = getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('step', '1');
  });

  it('respects custom min, max, step', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Rate" min={10} max={200} step={5} />,
    );
    const slider = getByRole('slider', { name: 'Rate' });
    expect(slider).toHaveAttribute('min', '10');
    expect(slider).toHaveAttribute('max', '200');
    expect(slider).toHaveAttribute('step', '5');
  });

  it('renders helpText', () => {
    const { getByText } = renderWithTheme(
      <Slider label="Zoom" helpText="Drag to adjust" />,
    );
    expect(getByText('Drag to adjust')).toBeInTheDocument();
  });

  it('renders errorText and sets aria-invalid when validationState is error', () => {
    const { getByRole, getByText } = renderWithTheme(
      <Slider label="Threshold" validationState="error" errorText="Invalid value" />,
    );
    expect(getByText('Invalid value')).toBeInTheDocument();
    expect(getByRole('slider', { name: 'Threshold' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables the input', () => {
    const { getByRole } = renderWithTheme(<Slider label="Volume" isDisabled />);
    expect(getByRole('slider', { name: 'Volume' })).toBeDisabled();
  });

  it('sets required aria attribute', () => {
    const { getByRole } = renderWithTheme(<Slider label="Volume" isRequired />);
    // FormLabel appends "required *" indicator to the accessible name
    expect(getByRole('slider', { name: /Volume/ })).toHaveAttribute('aria-required', 'true');
  });

  it('uncontrolled: defaultValue sets initial value', () => {
    const { getByRole } = renderWithTheme(<Slider label="Volume" defaultValue={42} />);
    expect(getByRole('slider', { name: 'Volume' })).toHaveValue('42');
  });

  it('controlled: reflects value prop', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" value={75} onChange={() => {}} />,
    );
    expect(getByRole('slider', { name: 'Volume' })).toHaveValue('75');
  });

  it('controlled: calls onChange with correct numeric value', () => {
    const handleChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" defaultValue={40} onChange={handleChange} />,
    );
    const slider = getByRole('slider', { name: 'Volume' });
    fireEvent.change(slider, { target: { value: '55' } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 55,
        event: expect.any(Object),
      }),
    );
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" isDisabled defaultValue={50} onChange={handleChange} />,
    );
    const slider = getByRole('slider', { name: 'Volume' });
    await user.click(slider);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('sets aria-valuemin and aria-valuemax', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Rate" min={10} max={90} defaultValue={50} />,
    );
    const slider = getByRole('slider', { name: 'Rate' });
    expect(slider).toHaveAttribute('aria-valuemin', '10');
    expect(slider).toHaveAttribute('aria-valuemax', '90');
  });

  it('sets --slider-fill-pct correctly on render (SSR-safe computation)', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" value={40} min={0} max={100} onChange={() => {}} />,
    );
    const slider = getByRole('slider', { name: 'Volume' });
    // CSS custom properties in inline style: use getAttribute for reliability in JSDOM
    expect(slider.getAttribute('style')).toMatch(/--slider-fill-pct:\s*40%/);
  });

  it('fill pct guards against min === max (no divide-by-zero)', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Static" value={50} min={50} max={50} onChange={() => {}} />,
    );
    const slider = getByRole('slider', { name: 'Static' });
    expect(slider.getAttribute('style')).toMatch(/--slider-fill-pct:\s*0%/);
  });

  it('sets name attribute', () => {
    const { getByRole } = renderWithTheme(<Slider label="Volume" name="volume" />);
    expect(getByRole('slider', { name: 'Volume' })).toHaveAttribute('name', 'volume');
  });

  it('renders large size (snapshot)', () => {
    const { container } = renderWithTheme(<Slider label="Volume" size="large" />);
    expect(container).toMatchSnapshot();
  });

  it('renders medium size (snapshot)', () => {
    const { container } = renderWithTheme(<Slider label="Volume" size="medium" />);
    expect(container).toMatchSnapshot();
  });

  it('renders label on left (snapshot)', () => {
    const { container } = renderWithTheme(
      <Slider label="Volume" labelPosition="left" />,
    );
    expect(container).toMatchSnapshot();
  });
});
