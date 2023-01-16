/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Radio />', () => {
  it('should render radio with label', () => {
    const labelText = 'Remember password';
    const { toJSON, getByText } = renderWithTheme(
      <RadioGroup label="Radio group">
        <Radio value="a">{labelText}</Radio>
      </RadioGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
    expect(getByText(labelText)).toBeDefined();
  });

  it('should render helpText', () => {
    const labelText = 'Remember password';
    const helpText = 'This has to be checked';
    const { getByText } = renderWithTheme(
      <RadioGroup label="Radio group">
        <Radio value="a" helpText={helpText}>
          {labelText}
        </Radio>
      </RadioGroup>,
    );
    expect(getByText(helpText)).toBeDefined();
  });

  it('should set disabled state with isDisabled', () => {
    const labelText = 'Remember password';
    const { toJSON, queryByA11yState } = renderWithTheme(
      <RadioGroup label="Radio group">
        <Radio value="a" isDisabled>
          {labelText}
        </Radio>
      </RadioGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
    const radio = queryByA11yState({ disabled: true });
    expect(radio).toBeTruthy();
    expect(radio?.props?.accessibilityState).toStrictEqual({ checked: false, disabled: true });
  });

  test('user should be able to set checked state', () => {
    const labelText = 'Remember password';
    const { getByRole } = renderWithTheme(
      <RadioGroup label="Radio group">
        <Radio value="a">{labelText}</Radio>
      </RadioGroup>,
    );
    const radio = getByRole('radio');

    expect(radio.props.accessibilityState.checked).toBeFalsy();
    fireEvent.press(radio);
    expect(radio.props.accessibilityState.checked).toBeTruthy();
    fireEvent.press(radio);
    expect(radio.props.accessibilityState.checked).toBeTruthy();
  });

  it('should expose native element methods via ref', () => {
    let refValue = null;
    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);
      return (
        <RadioGroup label="Hello">
          <Radio
            value="apple"
            ref={(value) => {
              console.log(value);
              // @ts-expect-error
              ref.current = value;
              refValue = value;
            }}
          >
            Apple
          </Radio>
        </RadioGroup>
      );
    };

    renderWithTheme(<Example />);
    expect(refValue).toBeNull();
  });
});
