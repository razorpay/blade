import { fireEvent } from '@testing-library/react-native';

import { BaseInput } from '..';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import { CloseIcon, EyeIcon } from '~components/Icons';
import { Button } from '~components/Button';
import { createRef } from 'react';
import { act } from 'react-test-renderer';

// todo: tests should be updated for improved a11y after https://github.com/razorpay/blade/issues/696
describe('<BaseInput />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(<BaseInput label="Enter name" id="name" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const { getByText } = renderWithTheme(
      <BaseInput
        label="Enter name"
        id="name"
        validationState="success"
        successText="Success"
        helpText="Help"
        errorText="Error"
      />,
    );

    const successText = getByText('Success');

    expect(successText).toBeTruthy();
  });

  it('should display error validation state', () => {
    const { getByText } = renderWithTheme(
      <BaseInput
        label="Enter name"
        id="name"
        validationState="error"
        errorText="Error"
        successText="Success"
        helpText="Help"
      />,
    );

    const errorText = getByText('Error');

    expect(errorText).toBeTruthy();
  });

  it('should render with icons', () => {
    const { toJSON } = renderWithTheme(
      <BaseInput
        label="Enter name"
        placeholder="First Last"
        id="name"
        leadingIcon={EyeIcon}
        trailingIcon={CloseIcon}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const placeholder = 'First last';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getByPlaceholderText } = renderWithTheme(
      <BaseInput label="Enter name" placeholder={placeholder} id="name" autoFocus />,
    );

    const input = getByPlaceholderText(placeholder);

    // we assume auto focus is working with this prop in place, no simple way of asserting on focus otherwise
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('autoFocus', true);
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const placeholder = 'First last';
    const { getByPlaceholderText } = renderWithTheme(
      <BaseInput label="Enter name" placeholder={placeholder} id="name" isDisabled />,
    );

    const input = getByPlaceholderText(placeholder);
    expect(input).toBeDisabled();
  });

  it('should handle onChange', () => {
    const placeholder = 'First Last';
    const onChange = jest.fn();
    const userName = 'Divyanshu';

    const { getByPlaceholderText } = renderWithTheme(
      <BaseInput
        label="Enter name"
        placeholder={placeholder}
        id="name"
        name="name"
        onChange={onChange}
      />,
    );

    const input = getByPlaceholderText(placeholder);
    fireEvent.changeText(input, userName);

    // changeText changes entire text at once
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ name: 'name', value: userName });
  });

  it('should set value as an uncontrolled input', () => {
    const placeholder = 'First Last';
    const valueInitial = 'Divyanshu';
    const valueFinal = 'Divyanshu Maithani';

    const { getByDisplayValue, getByPlaceholderText } = renderWithTheme(
      <BaseInput label="Enter name" placeholder={placeholder} id="name" defaultValue={valueInitial} />,
    );

    const inputInitial = getByDisplayValue(valueInitial);
    expect(inputInitial).toBeTruthy;

    fireEvent.changeText(inputInitial, valueFinal);
    fireEvent.changeText(inputInitial, 'valueFinal');
    fireEvent.changeText(inputInitial, 'Divyanshu Maithani');
    getByDisplayValue(valueInitial)
    const inputFinal = getByDisplayValue('Divyanshu Maithani')
    expect(inputFinal).toBeTruthy();
  });
});
