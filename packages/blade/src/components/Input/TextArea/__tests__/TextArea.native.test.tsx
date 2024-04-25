/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import React from 'react';

import type { ReactTestInstance } from 'react-test-renderer';
import { TextArea } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Button } from '~components/Button';

const getTag = (tagName: string): ReactTestInstance => {
  return screen.queryAllByLabelText(`Close ${tagName} tag`)?.[0];
};

const bladeEmail = 'blade@gmail.com';
const tagEmail = 'tag@gmail.com';

describe('<TextArea />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(<TextArea label="Enter name" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const { getByText } = renderWithTheme(
      <TextArea
        label="Enter name"
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
      <TextArea
        label="Enter name"
        validationState="error"
        errorText="Error"
        successText="Success"
        helpText="Help"
      />,
    );

    const errorText = getByText('Error');

    expect(errorText).toBeTruthy();
  });

  it('should display help text', () => {
    const { getByText } = renderWithTheme(
      <TextArea label="Enter name" successText="Success" errorText="Error" helpText="Help" />,
    );

    const helpText = getByText('Help');

    expect(helpText).toBeTruthy();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const placeholder = 'First last';
    const { getByPlaceholderText } = renderWithTheme(
      // eslint-disable-next-line jsx-a11y/no-autofocus
      <TextArea label="Enter name" placeholder={placeholder} autoFocus />,
    );

    const input = getByPlaceholderText(placeholder);

    // we assume auto focus is working with this prop in place, no simple way of asserting on focus otherwise
    expect(input).toHaveProp('autoFocus', true);
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const placeholder = 'First last';
    const { getByPlaceholderText } = renderWithTheme(
      <TextArea label="Enter name" placeholder={placeholder} isDisabled />,
    );

    const input = getByPlaceholderText(placeholder);
    expect(input).toBeDisabled();
  });

  it('should handle onChange', () => {
    const placeholder = 'First Last';
    const onChange = jest.fn();
    const userName = 'Divyanshu';

    const { getByPlaceholderText } = renderWithTheme(
      <TextArea label="Enter name" placeholder={placeholder} name="name" onChange={onChange} />,
    );

    const input = getByPlaceholderText(placeholder);
    fireEvent.changeText(input, userName);

    // changeText changes entire text at once
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ name: 'name', value: userName });
  });

  it('should handle onFocus', () => {
    const placeholder = 'First Last';
    const onFocus = jest.fn();
    const name = 'userName';
    const userName = 'Kamlesh';

    const { getByPlaceholderText } = renderWithTheme(
      <TextArea
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
    const onBlur = jest.fn();
    const name = 'userName';
    const userName = 'Kamlesh';

    const { getByPlaceholderText } = renderWithTheme(
      <TextArea
        label="Enter name"
        placeholder={placeholder}
        name={name}
        defaultValue={userName}
        onBlur={onBlur}
      />,
    );

    const input = getByPlaceholderText(placeholder);
    fireEvent(input, 'onEndEditing', { nativeEvent: { text: userName } });
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledWith({ name, value: userName });
  });

  /**
   * No tests for uncontrolled input because react-native-testing-library doesn't support it
   * https://github.com/callstack/react-native-testing-library/issues/978#issuecomment-1203256954
   */
  it('should set value as a controlled input', () => {
    const valueInitial = 'Divyanshu';
    const valueFinal = 'Divyanshu Maithani';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = React.useState<string | undefined>(valueInitial);

      return (
        <TextArea label="Enter name" value={value} onChange={({ value }) => setValue(value)} />
      );
    };

    const { getByDisplayValue } = renderWithTheme(<ControlledInputExample />);

    const input = getByDisplayValue(valueInitial);

    fireEvent.changeText(input, valueFinal);

    getByDisplayValue(valueFinal);
  });

  it('should throw error when both value and defaultValue are passed', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() =>
      renderWithTheme(
        <TextArea label="Enter name" defaultValue="Kamlesh" value="Kamlesh Chandnani" />,
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
      const [value, setValue] = React.useState<string | undefined>(valueInitial);

      return (
        <TextArea
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
      const [value, setValue] = React.useState<string | undefined>(valueInitial);

      return (
        <TextArea
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
      <TextArea
        label="Enter name"
        placeholder={placeholder}
        isRequired
        helpText="First name and last name"
        defaultValue="Divyanshu"
        validationState="none"
      />,
    );

    const input = getByPlaceholderText(placeholder);
    expect(input).toBeEnabled();
  });

  it('should expose native element methods via ref', () => {
    let refValue = null;
    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);
      return (
        <TextArea
          label="ref test"
          ref={(value) => {
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
      <TextArea
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
          <TextArea
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

    const { getByRole, getByPlaceholderText } = renderWithTheme(<Example />);

    const input = getByPlaceholderText(placeholder);

    expect(getTag(bladeEmail)).toBeUndefined();
    fireEvent.changeText(input, bladeEmail);
    fireEvent(input, 'onKeyPress', { nativeEvent: { key: ',' } });
    expect(getTag(bladeEmail)).toBeOnTheScreen();

    fireEvent.press(getByRole('button', { name: 'Add More' }));

    expect(getTag(bladeEmail)).toBeOnTheScreen();
    expect(getTag('saurabh@razorpay.com')).toBeOnTheScreen();
    expect(getTag('chaitanya@razorpay.com')).toBeOnTheScreen();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <TextArea label="Enter name" testID="text-area-test-id" />,
    );

    expect(getByTestId('text-area-test-id')).toBeTruthy();
  });
});
