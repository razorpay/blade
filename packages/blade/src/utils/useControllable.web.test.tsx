/* eslint-disable @typescript-eslint/no-explicit-any */
import userEvent from '@testing-library/user-event';
import React from 'react';
import renderWithTheme from './testing/renderWithTheme.web';
import { useControllableState } from './useControllable';

const Example = ({
  value,
  defaultValue,
  onChange,
}: {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number, extra: any) => void;
}): React.ReactElement => {
  const [_value, setValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? 0,
    onChange: (value, extraData) => {
      onChange?.(value, extraData);
    },
  });

  return (
    <button
      onClick={() => {
        setValue((prev) => prev + 1, false, 'extra');
      }}
    >
      {_value}
    </button>
  );
};

describe('useControllableState', () => {
  it('should work with uncontrolled mode', async () => {
    const { getByRole } = renderWithTheme(<Example />);
    const user = userEvent.setup();
    expect(getByRole('button')).toHaveTextContent('0');
    await user.click(getByRole('button'));
    expect(getByRole('button')).toHaveTextContent('1');
  });

  it('should work with uncontrolled mode with defaultValue', async () => {
    const { getByRole } = renderWithTheme(<Example defaultValue={20} />);
    const user = userEvent.setup();
    expect(getByRole('button')).toHaveTextContent('20');
    await user.click(getByRole('button'));
    expect(getByRole('button')).toHaveTextContent('21');
  });

  it('should work with controlled mode', async () => {
    const { getByRole } = renderWithTheme(<Example value={1} />);
    const user = userEvent.setup();
    expect(getByRole('button')).toHaveTextContent('1');
    await user.click(getByRole('button'));
    // The value should not change because we did not provide an onChange handler
    expect(getByRole('button')).toHaveTextContent('1');
  });

  it('should work with controlled mode and onChange', async () => {
    const onChange = jest.fn();
    const ControlledExample = (): React.ReactElement => {
      const [value, setValue] = React.useState(1);
      return (
        <Example
          value={value}
          onChange={(value) => {
            setValue(value);
            onChange(value);
          }}
        />
      );
    };
    const { getByRole } = renderWithTheme(<ControlledExample />);
    expect(onChange).not.toHaveBeenCalled();
    const user = userEvent.setup();

    expect(getByRole('button')).toHaveTextContent('1');
    await user.click(getByRole('button'));
    expect(onChange).toHaveBeenCalledWith(2);
    expect(getByRole('button')).toHaveTextContent('2');
  });

  it('should call onChange properly when value changes', async () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(<Example defaultValue={1} onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();

    const user = userEvent.setup();
    await user.click(getByRole('button'));

    expect(onChange).toHaveBeenCalledWith(2, 'extra');
    expect(onChange).toHaveBeenCalledTimes(1);

    await user.click(getByRole('button'));
    expect(onChange).toHaveBeenCalledWith(3, 'extra');
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
