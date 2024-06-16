/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ReactElement } from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import React, { useState } from 'react';
import type { ReactTestInstance } from 'react-test-renderer';
import { TextInput } from '../';
import { InfoIcon } from '~components/Icons';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Button } from '~components/Button';

const getTag = (tagName: string): ReactTestInstance => {
  return screen.queryAllByLabelText(`Close ${tagName} tag`)?.[0];
};

const bladeEmail = 'blade@gmail.com';
const tagEmail = 'tag@gmail.com';

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

  it('should show spinner when isLoading is passed', () => {
    const label = 'Enter name';
    const valueInitial = 'Kamlesh';

    const { queryByRole } = renderWithTheme(
      <TextInput label={label} value={valueInitial} showClearButton={true} isLoading={true} />,
    );

    let clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();
    clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();
    const loadingSpinner = queryByRole('progressbar');
    expect(loadingSpinner).toBeTruthy();
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

  it('should handle onClick', () => {
    const placeholder = 'First Last';
    const onClick = jest.fn();

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter name" placeholder={placeholder} onClick={onClick} />,
    );

    const input = getByPlaceholderText(placeholder);
    fireEvent(input, 'focus', { nativeEvent: { text: '' } });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should handle onFocus', () => {
    const placeholder = 'First Last';
    const name = 'userName';
    const userName = 'Kamlesh';
    const onFocus = jest.fn();

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput
        label="Enter name"
        placeholder={placeholder}
        name={name}
        defaultValue={userName}
        onFocus={onFocus}
      />,
    );

    const input = getByPlaceholderText(placeholder);
    fireEvent(input, 'focus', { nativeEvent: { text: userName } });

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledWith({ name, value: userName });
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
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <TextInput label="Enter name" defaultValue="Kamlesh" value="Kamlesh Chandnani" />,
      ),
    ).toThrow(
      `[Blade: Input]: Either 'value' or 'defaultValue' shall be passed. This decides if the input field is controlled or uncontrolled`,
    );
    mockConsoleError.mockRestore();
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

  it('should not show clear button on initial render if showClearButton is false', () => {
    const label = 'Enter name';
    const valueInitial = '123';
    const onClearButtonClick = jest.fn();

    const { getByDisplayValue, queryByRole } = renderWithTheme(
      <TextInput
        label={label}
        defaultValue={valueInitial}
        showClearButton={false}
        onClearButtonClick={onClearButtonClick}
      />,
    );
    const input = getByDisplayValue(valueInitial);
    expect(input).toBeTruthy();

    const clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();
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

    expect(input).toHaveProp('keyboardType', 'default');
    expect(input).toHaveProp('returnKeyType', 'default');
    expect(input).toHaveProp('autoCompleteType', 'off');
    expect(input).toHaveProp('textContentType', 'none');
  });

  it(`type='telephone' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const placeholder = '91xxxxxxxx';

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter Phone" placeholder={placeholder} type="telephone" />,
    );

    const input = getByPlaceholderText(placeholder);

    expect(input).toHaveProp('keyboardType', 'phone-pad');
    expect(input).toHaveProp('returnKeyType', 'done');
    expect(input).toHaveProp('autoCompleteType', 'tel');
    expect(input).toHaveProp('textContentType', 'telephoneNumber');
  });

  it(`type='email' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const placeholder = 'abc@gmail.com';

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter Email" placeholder={placeholder} type="email" />,
    );

    const input = getByPlaceholderText(placeholder);

    expect(input).toHaveProp('keyboardType', 'email-address');
    expect(input).toHaveProp('returnKeyType', 'done');
    expect(input).toHaveProp('autoCompleteType', 'email');
    expect(input).toHaveProp('textContentType', 'emailAddress');
  });

  it(`type='url' should have correct keyboard type, autocomplete suggestions, autocapitalize and keyboard return key`, () => {
    const placeholder = 'https://abc.com';

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter Company Website" placeholder={placeholder} type="url" />,
    );

    const input = getByPlaceholderText(placeholder);

    expect(input).toHaveProp('keyboardType', 'url');
    expect(input).toHaveProp('returnKeyType', 'go');
    expect(input).toHaveProp('autoCompleteType', 'off');
    expect(input).toHaveProp('textContentType', 'none');
    expect(input).toHaveProp('autoCapitalize', 'none');
  });

  it(`type='number' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const placeholder = '2500';

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter Monthly Income" placeholder={placeholder} type="number" />,
    );

    const input = getByPlaceholderText(placeholder);

    expect(input).toHaveProp('keyboardType', 'decimal-pad');
    expect(input).toHaveProp('returnKeyType', 'done');
    expect(input).toHaveProp('autoCompleteType', 'off');
    expect(input).toHaveProp('textContentType', 'none');
  });

  it(`type='search' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const placeholder = 'Search something';

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput label="Enter Search Query" placeholder={placeholder} type="search" />,
    );

    const input = getByPlaceholderText(placeholder);

    expect(input).toHaveProp('keyboardType', 'default');
    expect(input).toHaveProp('returnKeyType', 'search');
    expect(input).toHaveProp('autoCompleteType', 'off');
    expect(input).toHaveProp('textContentType', 'none');
  });

  it('should expose native element methods via ref', () => {
    let refValue = null;
    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);
      return (
        <TextInput
          label="ref test"
          ref={(value) => {
            console.log(value);
            // @ts-expect-error
            ref.current = value;
            refValue = value;
          }}
        />
      );
    };

    renderWithTheme(<Example />);
    expect(refValue).toHaveProperty('focus');
  });

  it(`should add tags in uncontrolled API`, () => {
    const label = 'Enter Name';
    const placeholder = 'Enter your name';
    const tagChangeCallback = jest.fn();

    const { getByPlaceholderText } = renderWithTheme(
      <TextInput
        label={label}
        placeholder={placeholder}
        isTaggedInput={true}
        onTagChange={tagChangeCallback}
      />,
    );

    const input = getByPlaceholderText(placeholder);

    expect(getTag(bladeEmail)).toBeUndefined();
    fireEvent.changeText(input, bladeEmail);
    fireEvent(input, 'onKeyPress', { nativeEvent: { key: ',' } });
    expect(getTag(bladeEmail)).toBeOnTheScreen();
    expect(tagChangeCallback).toBeCalledWith({ tags: [bladeEmail] });

    expect(getTag(tagEmail)).toBeUndefined();
    fireEvent.changeText(input, tagEmail);
    fireEvent(input, 'onKeyPress', { nativeEvent: { key: ',' } });
    expect(tagChangeCallback).toBeCalledWith({ tags: [bladeEmail, tagEmail] });
  });

  it(`should add tags in controlled API`, () => {
    const label = 'Enter Name';
    const placeholder = 'Enter your name';

    const Example = (): React.ReactElement => {
      const [tags, setTags] = React.useState<string[]>([]);
      return (
        <>
          <TextInput
            label={label}
            isTaggedInput={true}
            tags={tags}
            onTagChange={({ tags }) => setTags(tags)}
            placeholder={placeholder}
          />
          <Button
            onClick={() => {
              setTags([...tags, 'saurabh@razorpay.com', 'chaitanya@razorpay.com']);
            }}
          >
            Add More
          </Button>
        </>
      );
    };

    const { getByRole, getByText, getByPlaceholderText } = renderWithTheme(<Example />);

    const input = getByPlaceholderText(placeholder);

    expect(getTag(bladeEmail)).toBeUndefined();
    fireEvent.changeText(input, bladeEmail);
    fireEvent(input, 'onKeyPress', { nativeEvent: { key: ',' } });
    expect(getTag(bladeEmail)).toBeOnTheScreen();

    fireEvent.press(getByRole('button', { name: 'Add More' }));

    expect(getTag(bladeEmail)).toBeOnTheScreen();
    expect(getByText('+ 2 More')).toBeOnTheScreen();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <TextInput label="Enter name" testID="text-input-test-id" />,
    );

    expect(getByTestId('text-input-test-id')).toBeTruthy();
  });
});
