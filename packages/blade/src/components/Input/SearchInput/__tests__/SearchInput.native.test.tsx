/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ReactElement } from 'react';
import { fireEvent } from '@testing-library/react-native';
import React, { useState } from 'react';
import { SearchInput } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SearchInput />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(<SearchInput label="Enter name" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should display help text', () => {
    const { getByText } = renderWithTheme(
      <SearchInput
        label="Search here"
        placeholder="Search payment products, settings, and more"
        helpText="Enter an item to search"
      />,
    );

    const helpText = getByText('Enter an item to search');

    expect(helpText).toBeTruthy();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const placeholder = 'Search payment products, settings, and more';
    const { getByPlaceholderText } = renderWithTheme(
      // eslint-disable-next-line jsx-a11y/no-autofocus
      <SearchInput label="Search here" placeholder={placeholder} autoFocus />,
    );

    const input = getByPlaceholderText(placeholder);
    // we assume auto focus is working with this prop in place, no simple way of asserting on focus otherwise
    expect(input).toHaveProp('autoFocus', true);
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const placeholder = 'Search payment products, settings, and more';
    const { getByPlaceholderText } = renderWithTheme(
      // eslint-disable-next-line jsx-a11y/no-autofocus
      <SearchInput label="Search here" placeholder={placeholder} isDisabled />,
    );

    const input = getByPlaceholderText(placeholder);

    expect(input).toBeDisabled();
  });

  it('should show spinner when isLoading is passed', () => {
    const label = 'Search here';
    const valueInitial = 'Kamlesh';

    const { queryByRole } = renderWithTheme(
      <SearchInput label={label} value={valueInitial} isLoading={true} />,
    );

    let clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();
    clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();
    const loadingSpinner = queryByRole('progressbar');
    expect(loadingSpinner).toBeTruthy();
  });

  it('should handle onChange', () => {
    const placeholder = 'Search payment products, settings, and more';
    const onChange = jest.fn();
    const userName = 'Kamlesh';

    const { getByPlaceholderText } = renderWithTheme(
      <SearchInput label="Search name" placeholder={placeholder} name="name" onChange={onChange} />,
    );

    const input = getByPlaceholderText(placeholder);
    fireEvent.changeText(input, userName);

    // changeText changes entire text at once so should be called once
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'name', value: userName });
  });

  it('should handle onClick', () => {
    const placeholder = 'Search payment products, settings, and more';
    const onClick = jest.fn();

    const { getByPlaceholderText } = renderWithTheme(
      <SearchInput label="Search name" placeholder={placeholder} onClick={onClick} />,
    );

    const input = getByPlaceholderText(placeholder);
    fireEvent(input, 'focus', { nativeEvent: { text: '' } });

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should handle onFocus', () => {
    const placeholder = 'Search payment products, settings, and more';
    const name = 'userName';
    const userName = 'Kamlesh';
    const onFocus = jest.fn();

    const { getByPlaceholderText } = renderWithTheme(
      <SearchInput
        label="Search name"
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
    const placeholder = 'Search payment products, settings, and more';
    const userName = 'Kamlesh';
    const onBlur = jest.fn();

    const { getByPlaceholderText } = renderWithTheme(
      <SearchInput
        label="Search name"
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
        <SearchInput label="Search name" value={value} onChange={({ value }) => setValue(value)} />
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
        <SearchInput label="Enter name" defaultValue="Kamlesh" value="Kamlesh Chandnani" />,
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

  it('should clear input on clear button click', () => {
    const valueInitial = 'Kamlesh';
    const valueFinal = '';

    const ControlledInput = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>(valueInitial);

      return (
        <SearchInput
          label="Enter name"
          value={value}
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

  it('should only show clear button when the user type in something', () => {
    const valueInitial = '';
    const valueFinal = 'Kamlesh';

    const ControlledInput = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>(valueInitial);

      return (
        <SearchInput
          label="Search name"
          value={value}
          onChange={() => setValue(valueFinal)}
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
    const placeholder = 'Search payment products, settings, and more';
    const { getByPlaceholderText } = renderWithTheme(
      <SearchInput
        label="Enter name"
        placeholder={placeholder}
        helpText="First name and last name"
        defaultValue="Kamlesh"
      />,
    );

    const input = getByPlaceholderText(placeholder);
    expect(input).toBeEnabled();
  });

  it(`should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const placeholder = 'Search something';

    const { getByPlaceholderText } = renderWithTheme(
      <SearchInput label="Enter Search Query" placeholder={placeholder} />,
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
        <SearchInput
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

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <SearchInput label="Search name" testID="search-input-test-id" />,
    );

    expect(getByTestId('search-input-test-id')).toBeTruthy();
  });
});
