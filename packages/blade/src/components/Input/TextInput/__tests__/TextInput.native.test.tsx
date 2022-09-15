import type { ReactElement } from 'react';
import { fireEvent } from '@testing-library/react-native';
import { useState } from 'react';
import { TextInput } from '../';
import { InfoIcon } from '~components/Icons';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

/**  @TODO: add test case for isLoading once spinner https://github.com/razorpay/blade/pull/685 is merged
 * 1. either of isLoading or clearbutton should be shown at a time
 * 2. if isLoading then the input should be disabled
 */
describe('<TextInput />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(<TextInput label="Enter name" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const { getByText } = renderWithTheme(
      <TextInput
        label="Enter name"
        validationState="success"
        successText="Success"
        errorText="Error"
        helpText="Help"
      />,
    );

    const successText = getByText('Success');

    expect(successText).toBeTruthy();
  });

  it('should display error validation state', () => {
    const { getByText } = renderWithTheme(
      <TextInput
        label="Enter name"
        placeholder="name"
        validationState="error"
        successText="Success"
        errorText="Error"
        helpText="Help"
      />,
    );

    const errorText = getByText('Error');

    expect(errorText).toBeTruthy();
  });

  it('should display help text', () => {
    const { getByText } = renderWithTheme(
      <TextInput label="Enter name" successText="Success" errorText="Error" helpText="Help" />,
    );

    const helpText = getByText('Help');

    expect(helpText).toBeTruthy();
  });

  it('should render with icon, prefix, suffix', () => {
    const { toJSON, getByText } = renderWithTheme(
      <TextInput
        label="Enter company website"
        type="url"
        placeholder="something"
        icon={InfoIcon}
        prefix="https://"
        suffix=".com"
      />,
    );
    const prefix = getByText('https://');
    expect(prefix).toBeTruthy();

    const suffix = getByText('.com');
    expect(suffix).toBeTruthy();

    expect(toJSON()).toMatchSnapshot();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const placeholder = 'First Last';
    const { getByPlaceholderText } = renderWithTheme(
      // eslint-disable-next-line jsx-a11y/no-autofocus
      <TextInput label="Enter name" placeholder={placeholder} autoFocus />,
    );

    const input = getByPlaceholderText(placeholder);
    // we assume auto focus is working with this prop in place, no simple way of asserting on focus otherwise
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('autoFocus', true);
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const placeholder = 'First Last';
    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter name" placeholder={placeholder} isDisabled />,
    );

    const input = getByPlaceholderText(placeholder);

    expect(input).toBeDisabled();
  });

  it('should handle onChange', () => {
    const placeholder = 'First Last';
    const onChange = jest.fn();
    const userName = 'Kamlesh';

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter name" placeholder={placeholder} name="name" onChange={onChange} />,
    );

    const input = getByPlaceholderText(placeholder);
    fireEvent.changeText(input, userName);

    // changeText changes entire text at once so should be called once
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'name', value: userName });
  });

  it('should handle onBlur', () => {
    const placeholder = 'First Last';
    const userName = 'Kamlesh';
    const onBlur = jest.fn();

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput
        label="Enter name"
        placeholder={placeholder}
        name="name"
        defaultValue={userName}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onBlur={onBlur}
      />,
    );

    const input = getByPlaceholderText(placeholder);
    // shifts user focus and therefore blurs the focussed input
    fireEvent(input, 'onEndEditing', { nativeEvent: { text: userName } });

    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledWith({ name: 'name', value: userName });
  });

  // no way to test focusable state
  /**
   * No tests for uncontrolled input because react-native-testing-library doesn't support it
   * https://github.com/callstack/react-native-testing-library/issues/978#issuecomment-1203256954
   */

  it('should set value as a controlled input', () => {
    const valueInitial = 'Kamlesh';
    const valueFinal = 'Kamlesh Chandnani';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>(valueInitial);

      return (
        <TextInput label="Enter name" value={value} onChange={({ value }) => setValue(value)} />
      );
    };

    const { getByDisplayValue } = renderWithTheme(<ControlledInputExample />);

    const input = getByDisplayValue(valueInitial);

    fireEvent.changeText(input, valueFinal);

    expect(getByDisplayValue(valueFinal)).toBeTruthy();
  });

  it('should throw error when both value and defaultValue are passed', () => {
    expect(() =>
      renderWithTheme(
        <TextInput label="Enter name" defaultValue="Kamlesh" value="Kamlesh Chandnani" />,
      ),
    ).toThrow(
      `[Blade: Input]: Either 'value' or 'defaultValue' shall be passed. This decides if the input field is controlled or uncontrolled`,
    );
  });

  /**
   * can't check clear button for uncontroled input with default value
   *  https://github.com/callstack/react-native-testing-library/issues/978#issuecomment-1203256954
   */

  it('should clear input on clear buton click', () => {
    const valueInitial = 'Kamlesh';
    const valueFinal = '';

    const ControlledInput = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>(valueInitial);

      return (
        <TextInput
          label="Enter name"
          value={value}
          showClearButton
          onClearButtonClick={() => setValue(valueFinal)}
        />
      );
    };

    const { getByDisplayValue, getByRole } = renderWithTheme(<ControlledInput />);

    const input = getByDisplayValue(valueInitial);
    expect(input).toBeTruthy();

    const clearButton = getByRole('button');
    fireEvent.press(clearButton);

    expect(getByDisplayValue(valueFinal)).toBeTruthy();
  });

  it('should only show clear buton when the user type in something', () => {
    const valueInitial = '';
    const valueFinal = 'Kamlesh';

    const ControlledInput = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>(valueInitial);

      return (
        <TextInput
          label="Enter name"
          value={value}
          onChange={() => setValue(valueFinal)}
          showClearButton
          onClearButtonClick={() => setValue(valueInitial)}
        />
      );
    };

    const { getByDisplayValue, getByRole, queryByRole } = renderWithTheme(<ControlledInput />);

    const input = getByDisplayValue(valueInitial);

    expect(input).toBeTruthy();

    let clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();

    fireEvent.changeText(input, valueFinal);

    expect(getByDisplayValue(valueFinal)).toBeTruthy();

    clearButton = getByRole('button');
    fireEvent.press(clearButton);

    expect(getByDisplayValue(valueInitial)).toBeTruthy();
  });

  it('should pass a11y', () => {
    // todo: tests should be updated for improved a11y after https://github.com/razorpay/blade/issues/696
    const placeholder = 'First Last';
    const { getByPlaceholderText } = renderWithTheme(
      <TextInput
        label="Enter name"
        placeholder={placeholder}
        isRequired
        helpText="First name and last name"
        defaultValue="Kamlesh"
        validationState="none"
      />,
    );

    const input = getByPlaceholderText(placeholder);
    expect(input).toBeEnabled();
  });

  it(`type='text' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const placeholder = 'First last';

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter name" placeholder={placeholder} type="text" />,
    );

    const input = getByPlaceholderText(placeholder);

    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('keyboardType', 'default');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('returnKeyType', 'default');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('autoCompleteType', 'off');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('textContentType', 'none');
  });

  it(`type='telephone' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const placeholder = '91xxxxxxxx';

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter Phone" placeholder={placeholder} type="telephone" />,
    );

    const input = getByPlaceholderText(placeholder);

    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('keyboardType', 'phone-pad');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('returnKeyType', 'done');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('autoCompleteType', 'tel');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('textContentType', 'telephoneNumber');
  });

  it(`type='email' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const placeholder = 'abc@gmail.com';

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter Email" placeholder={placeholder} type="email" />,
    );

    const input = getByPlaceholderText(placeholder);

    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('keyboardType', 'email-address');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('returnKeyType', 'done');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('autoCompleteType', 'email');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('textContentType', 'emailAddress');
  });

  it(`type='url' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const placeholder = 'https://abc.com';

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter Company Website" placeholder={placeholder} type="url" />,
    );

    const input = getByPlaceholderText(placeholder);

    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('keyboardType', 'url');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('returnKeyType', 'go');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('autoCompleteType', 'off');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('textContentType', 'none');
  });

  it(`type='numeric' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const placeholder = '2500';

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter Monthly Income" placeholder={placeholder} type="numeric" />,
    );

    const input = getByPlaceholderText(placeholder);

    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('keyboardType', 'decimal-pad');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('returnKeyType', 'done');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('autoCompleteType', 'off');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('textContentType', 'none');
  });

  it(`type='search' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const placeholder = 'Search something';

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter Search Query" placeholder={placeholder} type="search" />,
    );

    const input = getByPlaceholderText(placeholder);

    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('keyboardType', 'default');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('returnKeyType', 'search');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('autoCompleteType', 'off');
    // @ts-expect-error TS typings not being picked from library
    expect(input).toHaveProp('textContentType', 'none');
  });
});
