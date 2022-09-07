import userEvent from '@testing-library/user-event';

import { BaseInput } from '..';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import ThemeWrapper from '~src/_helpers/testing/themeWrapper';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';
import { CloseIcon, EyeIcon } from '~components/Icons';

describe('<BaseInput />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<BaseInput label="Enter name" id="name" />);

    expect(container).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const label = 'Enter name';
    const { getByText, getByLabelText } = renderWithTheme(
      <BaseInput label={label} id="name" validationState="success" successText="Success" />,
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
      <BaseInput label={label} id="name" validationState="error" errorText="Error" />,
    );

    const input = getByLabelText(label);
    const errorText = getByText('Error');

    expect(errorText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Error');
    expect(input).toBeInvalid();
  });

  it('should render with icons', () => {
    const { container } = renderWithTheme(
      <BaseInput
        label="Enter name"
        placeholder="First Last"
        id="name"
        leadingIcon={EyeIcon}
        trailingIcon={CloseIcon}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should be focussed when autoFocus flag is passed', () => {
    const label = 'Enter name';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getByLabelText } = renderWithTheme(<BaseInput label={label} id="name" autoFocus />);

    const input = getByLabelText(label);
    expect(input).toHaveFocus();
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Enter name';
    const { getByLabelText } = renderWithTheme(<BaseInput label={label} id="name" isDisabled />);

    const input = getByLabelText(label);
    expect(input).toBeDisabled();
  });

  it('should handle onChange', async () => {
    const label = 'Enter name';
    const onChange = jest.fn();
    const user = userEvent.setup();
    const userName = 'Divyanshu';

    const { getByLabelText } = renderWithTheme(
      <BaseInput label={label} id="name" name="name" onChange={onChange} />,
    );

    const input = getByLabelText(label);
    await user.type(input, userName);

    // should be called for each keystroke
    expect(onChange).toHaveBeenCalledTimes(userName.length);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'name', value: userName });
  });

  it('should handle onBlur', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const userName = 'Divyanshu';
    const onBlur = jest.fn();

    renderWithTheme(
      <BaseInput
        label={label}
        id="name"
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

  it('should set value as an uncontrolled input', async () => {
    const user = userEvent.setup();
    const label = 'Enter name';
    const valueInitial = 'Divyanshu';
    const valueFinal = 'Divyanshu Maithani';

    const { getByLabelText } = renderWithTheme(
      <BaseInput label={label} id="name" defaultValue={valueInitial} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    await user.type(input, ' Maithani');
    expect(input).toHaveValue(valueFinal);
  });

  it('should set value as a controlled input', () => {
    const label = 'Enter name';
    const valueInitial = 'Divyanshu';
    const valueFinal = 'Divyanshu Maithani';

    const { getByLabelText, rerender } = renderWithTheme(
      <BaseInput label={label} id="name" value={valueInitial} />,
    );

    const input = getByLabelText(label);
    expect(input).toHaveValue(valueInitial);

    // simulate a controlled input by updating value prop
    rerender(
      <ThemeWrapper>
        <BaseInput label={label} id="name" value={valueFinal} />
      </ThemeWrapper>,
    );
    expect(getByLabelText(label)).toHaveValue(valueFinal);
  });

  it('should pass a11y', async () => {
    const { getByRole } = renderWithTheme(
      <BaseInput
        label="Enter name"
        id="name"
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

    // There's some issue in jest-axe so we mock this function
    window.getComputedStyle = jest.fn();
    await assertAccessible(input);
    jest.clearAllMocks();
  });
});
