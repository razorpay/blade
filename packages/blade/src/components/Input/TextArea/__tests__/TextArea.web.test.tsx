import userEvent from '@testing-library/user-event';
import React from 'react';
import type { ReactElement } from 'react';
import { waitFor, screen } from '@testing-library/react';
import { TextArea } from '../TextArea';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Button } from '~components/Button';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const getTag = (tagName: string): HTMLElement => {
  return screen.queryAllByLabelText(`Close ${tagName} tag`)?.[0];
};

const bladeEmail = 'blade@gmail.com';
const tagEmail = 'tag@gmail.com';

describe('<TextArea />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<TextArea label="Enter name" />);

    expect(container).toMatchSnapshot();
  });

  it('should render large size', () => {
    const { container } = renderWithTheme(
      <TextArea label="Enter name" size="large" maxCharacters={100} />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should limit with maxCharacters', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';

    const { getByLabelText } = renderWithTheme(<TextArea maxCharacters={5} label={label} />);

    const input = getByLabelText(label);
    await user.type(input, '123456789');

    expect(input).toHaveValue('12345');
  });

  it('should clear the input when uncontrolled', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const inputValue = 'Hello world';

    const { getByLabelText } = renderWithTheme(
      <TextArea defaultValue={inputValue} showClearButton label={label} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue(inputValue);

    const clearButton = getByLabelText(/Clear/i);
    await user.click(clearButton);

    expect(input).toHaveFocus();
    expect(input).toHaveValue('');
  });

  it('should clear the input when controlled', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const inputValue = 'Hello world';

    const ControlledInputExample = (): React.ReactElement => {
      const [value, setValue] = React.useState<string | undefined>(inputValue);

      return (
        <TextArea
          value={value}
          onChange={({ value }) => setValue(value)}
          showClearButton
          onClearButtonClick={() => {
            setValue('');
          }}
          label={label}
        />
      );
    };
    const { getByLabelText } = renderWithTheme(<ControlledInputExample />);

    const input = getByLabelText(label);
    expect(input).toHaveValue(inputValue);

    const clearButton = getByLabelText(/Clear/i);
    await user.click(clearButton);

    expect(input).toHaveFocus();
    expect(input).toHaveValue('');
  });

  it('should set number of lines', () => {
    const label = 'Enter name';

    const { container } = renderWithTheme(<TextArea numberOfLines={3} label={label} />);

    expect(container).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const label = 'Enter name';
    const { getByText, getByLabelText } = renderWithTheme(
      <TextArea
        label={label}
        validationState="success"
        successText="Success"
        helpText="Help"
        errorText="Error"
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
      <TextArea
        label={label}
        validationState="error"
        errorText="Error"
        helpText="Help"
        successText="Success"
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
      <TextArea label="Enter name" successText="Success" errorText="Error" helpText="Help" />,
    );

    const input = getByLabelText(label);
    const helpText = getByText('Help');

    expect(helpText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Help');
    expect(input).toBeValid();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const label = 'Enter name';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getByLabelText } = renderWithTheme(<TextArea label={label} autoFocus />);

    const input = getByLabelText(label);
    expect(input).toHaveFocus();
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Enter name';
    const { getByLabelText } = renderWithTheme(<TextArea label={label} isDisabled />);

    const input = getByLabelText(label);
    expect(input).toBeDisabled();
  });

  it('should handle onChange', async () => {
    const label = 'Enter name';
    const onChange = jest.fn();
    const user = userEvent.setup();
    const userName = 'Divyanshu';

    const { getByLabelText } = renderWithTheme(
      <TextArea label={label} name="name" onChange={onChange} />,
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
      <TextArea label={label} name={name} defaultValue={userName} onFocus={onFocus} />,
    );

    // focus into textarea
    await user.tab();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledWith({ name, value: userName });
  });

  it('should handle onBlur', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const userName = 'Divyanshu';
    const onBlur = jest.fn();

    renderWithTheme(
      <TextArea
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
    const userName = 'Divyanshu';

    const { getByLabelText } = renderWithTheme(
      <TextArea label={label} name="name" defaultValue={userName} />,
    );

    const input = getByLabelText(label);

    expect(input).not.toHaveFocus();
    await user.tab();
    expect(input).toHaveFocus();
  });

  it('should set value as an uncontrolled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const valueInitial = 'Divyanshu';
    const valueFinal = 'Divyanshu Maithani';

    const { getByLabelText } = renderWithTheme(
      <TextArea label={label} defaultValue={valueInitial} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, ' Maithani');
    expect(input).toHaveValue(valueFinal);
  });

  it('should set value as a controlled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const valueInitial = 'Divyanshu';
    const valueFinal = 'Divyanshu Maithani';

    const ControlledInputExample = (): ReactElement => {
      const [value, setValue] = React.useState<string | undefined>(valueInitial);

      return <TextArea label={label} value={value} onChange={({ value }) => setValue(value)} />;
    };

    const { getByLabelText } = renderWithTheme(<ControlledInputExample />);

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, ' Maithani');
    expect(input).toHaveValue(valueFinal);
  });

  it('should only show clear buton when the user type in something', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const onClearButtonClick = jest.fn();

    const { getByLabelText, getByRole, queryByRole } = renderWithTheme(
      <TextArea label={label} showClearButton onClearButtonClick={onClearButtonClick} />,
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

  it('should pass a11y', async () => {
    const { getByRole } = renderWithTheme(
      <TextArea
        label="Enter name"
        isRequired
        helpText="First name and last name"
        defaultValue="Divyanshu"
        validationState="none"
      />,
    );

    const input = getByRole('textbox');
    expect(input).toBeRequired();
    expect(input).toBeValid();
    expect(input).toBeEnabled();

    await assertAccessible(input);
  });

  it(`should expose native element methods via ref`, async () => {
    const label = 'Enter Text';

    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);

      return (
        <>
          <TextArea ref={ref} label={label} />
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
      <TextArea label={label} isTaggedInput={true} onTagChange={tagChangeCallback} />,
    );

    const input = getByLabelText(label);

    expect(getTag(bladeEmail)).toBeUndefined();
    await userEvent.type(input, bladeEmail);
    await userEvent.type(input, ',');
    expect(getTag(bladeEmail)).toBeVisible();
    expect(tagChangeCallback).toBeCalledWith({ tags: [bladeEmail] });

    expect(getTag(tagEmail)).toBeUndefined();
    await userEvent.type(input, tagEmail);
    await userEvent.keyboard('{ENTER}');
    expect(getTag(tagEmail)).toBeVisible();
    expect(tagChangeCallback).toBeCalledWith({ tags: [bladeEmail, tagEmail] });

    await userEvent.keyboard('{Backspace}');
    expect(getTag(tagEmail)).toBeUndefined();
    expect(tagChangeCallback).toBeCalledWith({ tags: [bladeEmail] });

    await userEvent.click(getTag(bladeEmail));
    await waitFor(() => expect(getTag(bladeEmail)).not.toBeVisible());
  });

  it(`should add tags in controlled API`, async () => {
    const label = 'Enter Name';

    const Example = (): React.ReactElement => {
      const [tags, setTags] = React.useState<string[]>([]);
      return (
        <>
          <TextArea
            label={label}
            isTaggedInput={true}
            tags={tags}
            onTagChange={({ tags }) => setTags(tags)}
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

    const { getByLabelText, getByRole } = renderWithTheme(<Example />);

    const input = getByLabelText(label);

    expect(getTag(bladeEmail)).toBeUndefined();
    await userEvent.type(input, bladeEmail);
    await userEvent.type(input, ',');
    expect(getTag(bladeEmail)).toBeVisible();

    expect(getTag(tagEmail)).toBeUndefined();
    await userEvent.type(input, tagEmail);
    await userEvent.keyboard('{ENTER}');
    expect(getTag(tagEmail)).toBeVisible();

    await userEvent.keyboard('{Backspace}');
    expect(getTag(tagEmail)).toBeUndefined();

    await userEvent.click(getByRole('button', { name: 'Add More' }));

    expect(getTag(bladeEmail)).toBeVisible();
    expect(getTag('saurabh@razorpay.com')).toBeVisible();
    expect(getTag('chaitanya@razorpay.com')).toBeVisible();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <TextArea label="Enter name" testID="text-area-test-id" />,
    );

    expect(getByTestId('text-area-test-id')).toBeTruthy();
  });

  it("should support adding data-analytics attribute to the textarea's container", () => {
    const { getByLabelText, container } = renderWithTheme(
      <TextArea label="Enter name" data-analytics-name="text-area" />,
    );

    expect(container).toMatchSnapshot();
    expect(getByLabelText('Enter name')).toHaveAttribute('data-analytics-name', 'text-area');
  });
});
