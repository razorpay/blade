import React from 'react';
import { fireEvent } from '@testing-library/react';
import { SegmentedControl } from '../SegmentedControl';
import { SegmentedControlItem } from '../SegmentedControlItem';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { CalendarIcon } from '~components/Icons';

describe('<SegmentedControl />', () => {
  it('should render with label and items', () => {
    const { getByText, getByRole } = renderWithTheme(
      <SegmentedControl label="Duration" name="duration">
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>,
    );

    expect(getByText('Duration')).toBeInTheDocument();
    expect(getByText('Monthly')).toBeInTheDocument();
    expect(getByText('Yearly')).toBeInTheDocument();
    expect(getByRole('radiogroup')).toBeInTheDocument();
  });

  it('should handle controlled value', () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <SegmentedControl label="Duration" name="duration" value="monthly" onChange={onChange}>
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>,
    );

    const radios = getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    expect(radios[1]).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(radios[1]);
    expect(onChange).toHaveBeenCalledWith({ name: 'duration', value: 'yearly' });
  });

  it('should handle uncontrolled defaultValue', () => {
    const { getAllByRole } = renderWithTheme(
      <SegmentedControl label="Duration" name="duration" defaultValue="yearly">
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>,
    );

    const radios = getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('aria-checked', 'false');
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  });

  it('should handle disabled group', () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <SegmentedControl label="Duration" name="duration" isDisabled onChange={onChange}>
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>,
    );

    const radios = getAllByRole('radio');
    expect(radios[0]).toBeDisabled();
    expect(radios[1]).toBeDisabled();

    fireEvent.click(radios[1]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should handle individual item disabled', () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <SegmentedControl label="Duration" name="duration" onChange={onChange}>
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="yearly" label="Yearly" isDisabled />
      </SegmentedControl>,
    );

    const radios = getAllByRole('radio');
    expect(radios[0]).not.toBeDisabled();
    expect(radios[1]).toBeDisabled();

    fireEvent.click(radios[1]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should render with icon', () => {
    const { container } = renderWithTheme(
      <SegmentedControl label="Duration" name="duration">
        <SegmentedControlItem value="monthly" label="Monthly" icon={CalendarIcon} />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render error state', () => {
    const { getByText } = renderWithTheme(
      <SegmentedControl
        label="Duration"
        name="duration"
        validationState="error"
        errorText="Please select a duration"
      >
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>,
    );

    expect(getByText('Please select a duration')).toBeInTheDocument();
  });

  it('should render help text', () => {
    const { getByText } = renderWithTheme(
      <SegmentedControl label="Duration" name="duration" helpText="Choose a duration">
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>,
    );

    expect(getByText('Choose a duration')).toBeInTheDocument();
  });

  it('should support accessibilityLabel', () => {
    const { getByRole } = renderWithTheme(
      <SegmentedControl accessibilityLabel="Billing duration" name="duration">
        <SegmentedControlItem value="monthly" label="Monthly" />
        <SegmentedControlItem value="yearly" label="Yearly" />
      </SegmentedControl>,
    );

    expect(getByRole('radiogroup')).toBeInTheDocument();
  });
});
