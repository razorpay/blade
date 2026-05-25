import { fireEvent } from '@testing-library/react';
import React from 'react';
import { Slider } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<Slider />', () => {
  it('should render Slider with default props', () => {
    const { container } = renderWithTheme(<Slider label="Volume" />);
    expect(container).toMatchSnapshot();
  });

  it('should render Slider with custom min, max, and step', () => {
    const { container } = renderWithTheme(
      <Slider label="Volume" min={10} max={50} step={5} defaultValue={25} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with disabled state', () => {
    const { container, getByRole } = renderWithTheme(<Slider label="Volume" isDisabled />);
    expect(container).toMatchSnapshot();
    expect(getByRole('slider')).toBeDisabled();
  });

  it('should render with defaultValue', () => {
    const { getByRole } = renderWithTheme(<Slider label="Volume" defaultValue={60} />);
    const slider = getByRole('slider');
    expect(slider).toHaveValue('60');
  });

  it('should render with controlled value', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" value={42} onChange={jest.fn()} />,
    );
    const slider = getByRole('slider');
    expect(slider).toHaveValue('42');
  });

  it('should render with helpText', () => {
    const { getByText } = renderWithTheme(
      <Slider label="Volume" helpText="Adjust the volume level" />,
    );
    expect(getByText('Adjust the volume level')).toBeInTheDocument();
  });

  it('should render with errorText when validationState is error', () => {
    const { getByText } = renderWithTheme(
      <Slider label="Volume" errorText="Value out of range" validationState="error" />,
    );
    expect(getByText('Value out of range')).toBeInTheDocument();
  });

  it('should render with successText when validationState is success', () => {
    const { getByText } = renderWithTheme(
      <Slider label="Volume" successText="Valid range" validationState="success" />,
    );
    expect(getByText('Valid range')).toBeInTheDocument();
  });

  it('should not show errorText when validationState is not error', () => {
    const { queryByText } = renderWithTheme(
      <Slider
        label="Volume"
        errorText="Value out of range"
        helpText="Help text"
        validationState="none"
      />,
    );
    expect(queryByText('Value out of range')).not.toBeInTheDocument();
    expect(queryByText('Help text')).toBeInTheDocument();
  });

  it('should call onChange when value changes', () => {
    const onChangeMock = jest.fn();
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" defaultValue={50} onChange={onChangeMock} />,
    );
    const slider = getByRole('slider');
    fireEvent.change(slider, { target: { value: '70' } });
    expect(onChangeMock).toHaveBeenCalledWith(expect.objectContaining({ value: 70 }));
  });

  it('should support controlled state', () => {
    const ControlledSlider = (): React.ReactElement => {
      const [value, setValue] = React.useState(50);
      return (
        <>
          <Slider label="Volume" value={value} onChange={({ value: v }) => setValue(v)} />
          <span data-testid="current-value">{value}</span>
        </>
      );
    };
    const { getByRole, getByTestId } = renderWithTheme(<ControlledSlider />);
    const slider = getByRole('slider');
    fireEvent.change(slider, { target: { value: '75' } });
    expect(getByTestId('current-value').textContent).toBe('75');
  });

  it('should display label text', () => {
    const { getByText } = renderWithTheme(<Slider label="Audio Volume" />);
    expect(getByText('Audio Volume')).toBeInTheDocument();
  });

  it('should display min and max values', () => {
    const { getAllByText } = renderWithTheme(<Slider label="Volume" min={10} max={90} />);
    expect(getAllByText('10').length).toBeGreaterThan(0);
    expect(getAllByText('90').length).toBeGreaterThan(0);
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Slider label="Volume" testID="slider-test" />);
    expect(getByTestId('slider-test')).toBeTruthy();
  });

  it('should support data-analytics attributes', () => {
    const { container } = renderWithTheme(
      <Slider label="Volume" data-analytics-slider="volume-control" testID="slider-test" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should clamp values outside of min/max range', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" value={150} max={100} onChange={jest.fn()} />,
    );
    const slider = getByRole('slider');
    expect(slider).toHaveValue('100');
  });

  it('should pass a11y', async () => {
    const { container } = renderWithTheme(
      <Slider label="Volume" defaultValue={50} accessibilityLabel="Volume control" />,
    );
    await assertAccessible(container);
  });

  it('should have aria-invalid when validationState is error', () => {
    const { getByRole } = renderWithTheme(
      <Slider label="Volume" validationState="error" errorText="Out of range" />,
    );
    expect(getByRole('slider')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should render with necessityIndicator required', () => {
    const { getByText } = renderWithTheme(<Slider label="Volume" necessityIndicator="required" />);
    expect(getByText('Volume')).toBeInTheDocument();
    expect(getByText('*')).toBeInTheDocument();
  });

  it('should render with necessityIndicator optional', () => {
    const { getByText } = renderWithTheme(<Slider label="Volume" necessityIndicator="optional" />);
    expect(getByText('Volume')).toBeInTheDocument();
    expect(getByText('(optional)')).toBeInTheDocument();
  });

  it('should render small size', () => {
    const { container } = renderWithTheme(<Slider label="Volume" size="small" />);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size', () => {
    const { container } = renderWithTheme(<Slider label="Volume" size="medium" />);
    expect(container).toMatchSnapshot();
  });
});
