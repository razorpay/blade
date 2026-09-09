import userEvent from '@testing-library/user-event';

import type { ReactElement } from 'react';
import React, { useState } from 'react';
import { screen, waitFor } from '@testing-library/react';
import { TextInput } from '../';
import { InfoIcon } from '~components/Icons';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Button } from '~components/Button';
import { Link } from '~components/Link';

const getTag = (tagName: string): HTMLElement => {
  return screen.queryAllByLabelText(`Close ${tagName} tag`)?.[0];
};

const bladeEmail = 'blade@gmail.com';
const tagEmail = 'tag@gmail.com';

describe('<TextInput />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<TextInput label="Enter name" />);

    expect(container).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const label = 'Enter name';
    const { getByText, getByLabelText } = renderWithTheme(
      <TextInput
        label="Enter name"
        validationState="success"
        successText="Success"
        errorText="Error"
        helpText="Help"
      />,
    );

    const input = getByLabelText(label);
    const successText = getByText('Success');

    expect(successText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Success');
    expect(input).toBeValid();
  });

  it('should display error validation state', () => {
    const label = 'Enter name';
    const { getByText, getByLabelText } = renderWithTheme(
      <TextInput
        label="Enter name"
        validationState="error"
        successText="Success"
        errorText="Error"
        helpText="Help"
      />,
    );

    const input = getByLabelText(label);
    const errorText = getByText('Error');

    expect(errorText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Error');
    expect(input).toBeInvalid();
  });

  it('should display help text', () => {
    const label = 'Enter name';
    const { getByText, getByLabelText } = renderWithTheme(
      <TextInput label="Enter name" successText="Success" errorText="Error" helpText="Help" />,
    );

    const input = getByLabelText(label);
    const helpText = getByText('Help');

    expect(helpText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Help');
    expect(input).toBeValid();
  });

  it('should render with icon, prefix, suffix', () => {
    const { container, getByText } = renderWithTheme(
      <TextInput
        label="Enter company website"
        type="url"
        placeholder="something"
        leadingIcon={InfoIcon}
        prefix="https://"
        suffix=".com"
      />,
    );
    const prefix = getByText('https://');
    expect(prefix).toBeVisible();

    const suffix = getByText('.com');
    expect(suffix).toBeVisible();

    expect(container).toMatchSnapshot();
  });

  it('should render large size', () => {
    const { container } = renderWithTheme(
      <TextInput
        label="Enter company website"
        type="url"
        placeholder="something"
        leadingIcon={InfoIcon}
        trailingIcon={InfoIcon}
        prefix="https://"
        suffix=".com"
        trailingButton={<Link>Apply</Link>}
        size="large"
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const label = 'Enter name';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getByLabelText } = renderWithTheme(<TextInput label={label} autoFocus />);

    const input = getByLabelText(label);

    expect(input).toHaveFocus();
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Enter name';
    const { getByLabelText } = renderWithTheme(<TextInput label={label} isDisabled />);

    const input = getByLabelText(label);

    expect(input).toBeDisabled();
  });

  it('should show spinner when isLoading is passed', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';

    const { getByLabelText, queryByRole } = renderWithTheme(
      <TextInput label={label} showClearButton={true} isLoading={true} />,
    );

    const input = getByLabelText(label);
    let clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();
    await user.tab();
    /* We are intentionally making sure that the input is not disabled and focusable since we don't want the input to be disabled while the user is still typing. 
    For instance, in an autocomplete while the user types, API call is made for each letter and loader shows up but also allows the user to continue typing.
     */
    expect(input).toHaveFocus();
    await user.type(input, 'Kamlesh');
    clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();
    const loadingSpinner = queryByRole('progressbar');
    expect(loadingSpinner).toBeTruthy();
  });

  it('should handle onChange', async () => {
    const label = 'Enter name';
    const onChange = jest.fn();
    const user = userEvent.setup();
    const userName = 'Kamlesh';

    const { getByLabelText } = renderWithTheme(
      <TextInput label={label} name="name" onChange={onChange} />,
    );

    const input = getByLabelText(label);
    await user.type(input, userName);

    // should be called for each keystroke
    expect(onChange).toHaveBeenCalledTimes(userName.length);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'name', value: userName });
  });

  it('should handle onFocus', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const name = 'userName';
    const userName = 'Kamlesh';
    const onFocus = jest.fn();

    renderWithTheme(
      <TextInput label={label} name={name} defaultValue={userName} onFocus={onFocus} />,
    );

    // focus into textarea
    await user.tab();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledWith({ name, value: userName });
  });

  it('should handle onClick', async () => {
    const onClick = jest.fn();
    const label = 'Enter name';
    const { getByLabelText } = renderWithTheme(<TextInput label={label} onClick={onClick} />);

    const input = getByLabelText(label);
    await userEvent.click(input);
    //should be called for onClick
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should handle onBlur', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const userName = 'Kamlesh';
    const onBlur = jest.fn();

    renderWithTheme(
      <TextInput
        label={label}
        name="name"
        defaultValue={userName}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        onBlur={onBlur}
      />,
    );

    // shifts user focus and therefore blurs the focussed input
    await user.tab();

    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledWith({ name: 'name', value: userName });
  });

  it('should be focusable', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const userName = 'Kamlesh';

    const { getByLabelText } = renderWithTheme(
      <TextInput label={label} name="name" defaultValue={userName} />,
    );

    const input = getByLabelText(label);

    expect(input).not.toHaveFocus();

    await user.tab();
    expect(input).toHaveFocus();
  });

  it('should set value as an uncontrolled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const valueInitial = 'Kamlesh';
    const valueFinal = 'Kamlesh Chandnani';

    const { getByLabelText } = renderWithTheme(
      <TextInput label={label} defaultValue={valueInitial} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, ' Chandnani');
    expect(input).toHaveValue(valueFinal);
  });

  it('should set value as a controlled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const valueInitial = 'Kamlesh';
    const valueFinal = 'Kamlesh Chandnani';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = useState<string | undefined>(valueInitial);

      return <TextInput label={label} value={value} onChange={({ value }) => setValue(value)} />;
    };

    const { getByLabelText } = renderWithTheme(<ControlledInputExample />);

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, ' Chandnani');
    expect(input).toHaveValue(valueFinal);
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

  it('should clear input with defaultValue on clear buton click', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const onClearButtonClick = jest.fn();

    const { getByLabelText, getByRole } = renderWithTheme(
      <TextInput
        label={label}
        defaultValue="Kamlesh"
        showClearButton
        onClearButtonClick={onClearButtonClick}
      />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue('Kamlesh');

    const clearButton = getByRole('button');
    await user.click(clearButton);
    expect(onClearButtonClick).toHaveBeenCalledTimes(1);

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
  });

  it('should only show clear buton when the user type in something', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const onClearButtonClick = jest.fn();

    const { getByLabelText, getByRole, queryByRole } = renderWithTheme(
      <TextInput label={label} showClearButton onClearButtonClick={onClearButtonClick} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue('');

    let clearButton = queryByRole('button');
    expect(clearButton).toBeFalsy();

    await user.tab();
    expect(input).toHaveFocus();

    await user.type(input, 'Kamlesh');
    expect(input).toHaveValue('Kamlesh');

    clearButton = getByRole('button');
    await user.click(clearButton);
    expect(onClearButtonClick).toHaveBeenCalledTimes(1);

    expect(input).toHaveFocus();
    expect(input).toHaveValue('');
  });

  it('should not show clear button on initial render if showClearButton is false', () => {
    const label = 'Enter name';
    const onClearButtonClick = jest.fn();
    const valueInitial = '123';

    const { getByLabelText, queryByRole } = renderWithTheme(
      <TextInput
        label={label}
        defaultValue={valueInitial}
        showClearButton={false}
        onClearButtonClick={onClearButtonClick}
      />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    const clearButton = queryByRole('button');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should pass a11y', async () => {
    const { getByRole } = renderWithTheme(
      <TextInput
        label="Enter name"
        isRequired
        helpText="First name and last name"
        defaultValue="Kamlesh"
        validationState="none"
      />,
    );

    const input = getByRole('textbox');

    expect(input).toBeRequired();
    expect(input).toBeValid();
    expect(input).toBeEnabled();

    await assertAccessible(input);
  });

  it(`type='text' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const label = 'Enter Name';

    const { getByLabelText } = renderWithTheme(<TextInput label={label} type="text" />);

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputMode', 'text');
    expect(input).toHaveAttribute('enterKeyHint', 'enter');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it(`type='telephone' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const label = 'Enter Phone';

    const { getByLabelText } = renderWithTheme(<TextInput label={label} type="telephone" />);

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'tel');
    expect(input).toHaveAttribute('inputMode', 'tel');
    expect(input).toHaveAttribute('enterKeyHint', 'done');
    expect(input).toHaveAttribute('autoComplete', 'tel');
  });

  it(`type='email' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const label = 'Enter Email';

    const { getByLabelText } = renderWithTheme(<TextInput label={label} type="email" />);

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('inputMode', 'email');
    expect(input).toHaveAttribute('enterKeyHint', 'done');
    expect(input).toHaveAttribute('autoComplete', 'email');
  });

  it(`type='url' should have correct keyboard type, autocomplete suggestions, autocapitalize and keyboard return key`, () => {
    const label = 'Enter Company Website';

    const { getByLabelText } = renderWithTheme(<TextInput label={label} type="url" />);

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'url');
    expect(input).toHaveAttribute('inputMode', 'url');
    expect(input).toHaveAttribute('enterKeyHint', 'go');
    expect(input).toHaveAttribute('autoComplete', 'off');
    expect(input).toHaveAttribute('autocapitalize', 'none');
  });

  it(`type='number' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const label = 'Enter Monthly Income';

    const { getByLabelText } = renderWithTheme(<TextInput label={label} type="number" />);

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputMode', 'decimal');
    expect(input).toHaveAttribute('enterKeyHint', 'done');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it(`type='search' should have correct keyboard type, autocomplete suggestions and keyboard return key`, () => {
    const label = 'Enter Name';

    const { getByLabelText } = renderWithTheme(<TextInput label={label} type="search" />);

    const input = getByLabelText(label);

    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputMode', 'search');
    expect(input).toHaveAttribute('enterKeyHint', 'search');
    expect(input).toHaveAttribute('autoComplete', 'off');
  });

  it(`should expose native element methods via ref`, async () => {
    const label = 'Enter Name';

    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);

      return (
        <>
          <TextInput ref={ref} label={label} />
          <Button
            onClick={() => {
              ref.current?.focus();
            }}
          >
            Focus
          </Button>
        </>
      );
    };
    const { getByLabelText, getByRole } = renderWithTheme(<Example />);

    const input = getByLabelText(label);
    const button = getByRole('button');

    expect(input).not.toHaveFocus();

    await userEvent.click(button);
    expect(input).toHaveFocus();
  });

  it(`should add tags in uncontrolled API`, async () => {
    const label = 'Enter Name';
    const tagChangeCallback = jest.fn();

    const { getByLabelText } = renderWithTheme(
      <TextInput label={label} isTaggedInput={true} onTagChange={tagChangeCallback} />,
    );

    const input = getByLabelText(label);

    expect(getTag(bladeEmail)).toBeUndefined();
    await userEvent.type(input, bladeEmail);
    await userEvent.type(input, ',');
    expect(getTag(bladeEmail)).toBeVisible();
    expect(tagChangeCallback).toHaveBeenCalledTimes(1);
    expect(tagChangeCallback).toBeCalledWith({ tags: [bladeEmail] });

    expect(getTag(tagEmail)).toBeUndefined();
    await userEvent.type(input, tagEmail);
    await userEvent.keyboard('{ENTER}');
    expect(getTag(tagEmail)).toBeVisible();
    expect(tagChangeCallback).toHaveBeenCalledTimes(2);
    expect(tagChangeCallback).toBeCalledWith({ tags: [bladeEmail, tagEmail] });

    await userEvent.keyboard('{Backspace}');
    expect(getTag(tagEmail)).toBeUndefined();
    expect(tagChangeCallback).toBeCalledWith({ tags: [bladeEmail] });

    await userEvent.click(getTag(bladeEmail));
    await waitFor(() => expect(getTag(bladeEmail)).not.toBeVisible());
  });

  it(`should add tags in controlled API`, async () => {
    const label = 'Enter Name';
    const tagChangeCallback = jest.fn();

    const Example = (): React.ReactElement => {
      const [tags, setTags] = React.useState<string[]>([]);
      return (
        <>
          <TextInput
            label={label}
            isTaggedInput={true}
            tags={tags}
            onTagChange={({ tags }) => {
              setTags(tags);
              tagChangeCallback();
            }}
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

    const { getByLabelText, getByRole, getByText } = renderWithTheme(<Example />);

    const input = getByLabelText(label);

    expect(getTag(bladeEmail)).toBeUndefined();
    await userEvent.type(input, bladeEmail);
    await userEvent.type(input, ',');
    expect(getTag(bladeEmail)).toBeVisible();
    expect(tagChangeCallback).toHaveBeenCalledTimes(1);
    expect(getTag(tagEmail)).toBeUndefined();
    await userEvent.type(input, tagEmail);
    await userEvent.keyboard('{ENTER}');
    expect(getTag(tagEmail)).toBeVisible();
    expect(tagChangeCallback).toHaveBeenCalledTimes(2);

    await userEvent.keyboard('{Backspace}');
    expect(getTag(tagEmail)).toBeUndefined();

    await userEvent.click(getByRole('button', { name: 'Add More' }));

    expect(getTag(bladeEmail)).toBeVisible();
    expect(getByText('+2 More')).toBeInTheDocument();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <TextInput label="Enter name" testID="text-input-test-id" />,
    );

    expect(getByTestId('text-input-test-id')).toBeTruthy();
  });
  it('should accept data-analytics attribute', () => {
    const { getByLabelText, container } = renderWithTheme(
      <TextInput label="Enter name" data-analytics-name="Enter name" />,
    );

    expect(container).toMatchSnapshot();
    expect(getByLabelText('Enter name')).toHaveAttribute('data-analytics-name', 'Enter name');
  });
});

// ─── Formatted TextInput — controlled value sync ───────────────────────────────
// Reproduces the checkout AddNewCard scenario: parent strips non-digits in
// onChange and feeds the cleaned value back via `value`.
const ControlledCardInput = (): ReactElement => {
  const onlyDigits = (v: string): string => v.replace(/\D/g, '');
  const [value, setValue] = useState<string>('');
  return (
    <>
      <Button onClick={() => setValue('378282246310005')}>prefill</Button>
      <Button onClick={() => setValue('')}>reset</Button>
      <TextInput
        label="Card"
        format="#### #### #### ####"
        value={value}
        onChange={({ rawValue }) => setValue(onlyDigits(rawValue ?? ''))}
      />
    </>
  );
};

describe('<TextInput /> formatted + controlled value', () => {
  it('reflects consumer sanitisation (letters stripped) on screen', async () => {
    const { getByLabelText } = renderWithTheme(<ControlledCardInput />);
    const input = getByLabelText('Card');
    await userEvent.type(input, '4111abcd2222');
    // Letters must be stripped; digits formatted, no trailing delimiter.
    expect(input).toHaveValue('4111 2222');
  });

  it('rejects letters even when the sanitised value is unchanged', async () => {
    // Typing letters after "1234" leaves the same stored value, so the `value`
    // prop reference is identical. The display must still snap back to digits.
    const { getByLabelText } = renderWithTheme(<ControlledCardInput />);
    const input = getByLabelText('Card') as HTMLInputElement;

    await userEvent.type(input, '1234');
    expect(input).toHaveValue('1234');

    await userEvent.type(input, 'abc');
    expect(input).toHaveValue('1234');

    await userEvent.type(input, '1');
    expect(input).toHaveValue('1234 1');
  });

  it('reflects programmatic prefill after mount', async () => {
    const { getByLabelText, getByRole } = renderWithTheme(<ControlledCardInput />);
    await userEvent.click(getByRole('button', { name: 'prefill' }));
    expect(getByLabelText('Card')).toHaveValue('3782 8224 6310 005');
  });

  it('clears the field on programmatic reset', async () => {
    const { getByLabelText, getByRole } = renderWithTheme(<ControlledCardInput />);
    const input = getByLabelText('Card');
    await userEvent.type(input, '4111');
    expect(input).toHaveValue('4111');
    await userEvent.click(getByRole('button', { name: 'reset' }));
    expect(input).toHaveValue('');
  });

  it('does not leak a trailing delimiter when value ends on a group boundary', async () => {
    const { getByLabelText } = renderWithTheme(<ControlledCardInput />);
    const input = getByLabelText('Card');
    // 16 digits fills all four groups of "#### #### #### ####" exactly.
    await userEvent.type(input, '4111111111111111');
    expect(input).toHaveValue('4111 1111 1111 1111');
    // No trailing space after the 16th digit.
    expect((input as HTMLInputElement).value.endsWith(' ')).toBe(false);
  });

  it('places caret after typed digit when formatter inserts a delimiter at a group boundary', async () => {
    // Typing the 5th digit turns "1234" into "1234 5". The inserted space
    // shifts the digit right; caret must land after "5" (index 6), not before it (5).
    const { getByLabelText } = renderWithTheme(<ControlledCardInput />);
    const input = getByLabelText('Card') as HTMLInputElement;

    await userEvent.type(input, '12345');
    await waitFor(() => {
      expect(input.value).toBe('1234 5');
      expect(input.selectionStart).toBe(6); // after "5"
    });
  });
});

// ─── Formatted TextInput — bracket delimiter handling ─────────────────────────
// When the format pattern contains structural bracket pairs like "(###) ###-####",
// the closing bracket must always be emitted even when the value ends exactly
// on a group boundary inside the brackets.  Non-bracket delimiters (spaces,
// dashes, slashes) should still be suppressed to avoid trailing junk.
const BracketFormatInput = ({
  pattern,
  value,
}: {
  pattern: string;
  value: string;
}): ReactElement => {
  const onlyDigits = (v: string): string => v.replace(/\D/g, '');
  const [internalValue, setInternalValue] = useState<string>(value);
  return (
    <TextInput
      label="Phone"
      format={pattern}
      value={internalValue}
      onChange={({ rawValue }) => setInternalValue(onlyDigits(rawValue ?? ''))}
    />
  );
};

describe('<TextInput /> formatted — bracket delimiters', () => {
  it('preserves closing bracket when value fills the bracketed group exactly', () => {
    const { getByLabelText } = renderWithTheme(
      <BracketFormatInput pattern="(###) ###-####" value="123" />,
    );
    // "(123)" not "(123" — the ")" must survive even though value is exhausted.
    expect(getByLabelText('Phone')).toHaveValue('(123)');
  });

  it('does not emit trailing non-bracket delimiters after the closing bracket', () => {
    const { getByLabelText } = renderWithTheme(
      <BracketFormatInput pattern="(###) ###-####" value="123" />,
    );
    const input = getByLabelText('Phone') as HTMLInputElement;
    // No trailing space or dash after "(123)".
    expect(input.value).toBe('(123)');
  });

  it('preserves closing bracket for (####)-####-#### custom pattern', () => {
    const { getByLabelText } = renderWithTheme(
      <BracketFormatInput pattern="(####)-####-####" value="1234" />,
    );
    // "(1234)" not "(1234" — the ")" must survive.
    expect(getByLabelText('Phone')).toHaveValue('(1234)');
  });

  it('still strips trailing space for non-bracket patterns (card number)', () => {
    const { getByLabelText } = renderWithTheme(
      <BracketFormatInput pattern="#### #### #### ####" value="4111111111111111" />,
    );
    const input = getByLabelText('Phone') as HTMLInputElement;
    expect(input.value).toBe('4111 1111 1111 1111');
    expect(input.value.endsWith(' ')).toBe(false);
  });
});
