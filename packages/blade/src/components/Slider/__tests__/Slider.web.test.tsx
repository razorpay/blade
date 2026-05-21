import { fireEvent } from '@testing-library/react';
import React from 'react';
import { Slider } from '../Slider';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<Slider />', () => {
  it('should render slider with default props', () => {
    const { container } = renderWithTheme(<Slider accessibilityLabel="Volume" />);
    expect(container).toMatchSnapshot();
  });

  it('should render slider with label', () => {
    const { container, getByText } = renderWithTheme(
      <Slider label="Volume" defaultValue={30} />,
    );
    expect(container).toMatchSnapshot();
    expect(getByText('Volume')).toBeInTheDocument();
  });

  it('should render disabled slider', () => {
    const { container, getByRole } = renderWithTheme(
      <Slider label="Volume" isDisabled defaultValue={50} />,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('slider')).toBeDisabled();
  });

  it('should render slider with defaultValue', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" defaultValue={60} min={0} max={100} />,
    );
    expect(getByRole('slider')).toHaveValue('60');
  });

  it('should render controlled slider with value', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" value={75} min={0} max={100} onChange={jest.fn()} />,
    );
    expect(getByRole('slider')).toHaveValue('75');
  });

  it('should render slider with custom min/max', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Price" defaultValue={500} min={100} max={1000} />,
    );
    const slider = getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuemin', '100');
    expect(slider).toHaveAttribute('aria-valuemax', '1000');
  });

  it('should call onChange when value changes', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" defaultValue={30} onChange={onChange} />,
    );
    const slider = getByRole('slider');
    fireEvent.change(slider, { target: { value: '55' } });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: 55 }),
    );
  });

  it('should show current value when showValue is true', () => {
    const { getByText } = renderWithTheme(
      <Slider label="Volume" defaultValue={42} showValue />,
    );
    expect(getByText('42')).toBeInTheDocument();
  });

  it('should hide value when showValue is false', () => {
    const { queryByText } = renderWithTheme(
      <Slider label="Volume" defaultValue={42} showValue={false} />,
    );
    expect(queryByText('42')).not.toBeInTheDocument();
  });

  it('should render all sizes', () => {
    const { container: smallContainer } = renderWithTheme(
      <Slider label="Volume" size="small" />,
    );
    const { container: mediumContainer } = renderWithTheme(
      <Slider label="Volume" size="medium" />,
    );
    const { container: largeContainer } = renderWithTheme(
      <Slider label="Volume" size="large" />,
    );
    expect(smallContainer).toMatchSnapshot();
    expect(mediumContainer).toMatchSnapshot();
    expect(largeContainer).toMatchSnapshot();
  });

  it('should have proper aria attributes', () => {
    const { getByRole } = renderWithTheme(
      <Slider
        label="Volume"
        value={50}
        min={0}
        max={100}
        accessibilityLabel="Volume Control"
        onChange={jest.fn()}
      />,
    );
    const slider = getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');
  });

  it('should be accessible', async () => {
    const { container } = renderWithTheme(
      <Slider label="Volume" defaultValue={30} />,
    );
    await assertAccessible(container);
  });
});
