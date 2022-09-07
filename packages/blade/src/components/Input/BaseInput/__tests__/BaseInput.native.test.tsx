import { fireEvent } from '@testing-library/react-native';

import { BaseInput } from '..';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import ThemeWrapper from '~src/_helpers/testing/themeWrapper';
import { CloseIcon, EyeIcon } from '~components/Icons';

describe('<BaseInput />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(<BaseInput label="Enter name" id="name" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render success validation state', () => {
    const { toJSON } = renderWithTheme(
      <BaseInput label="Enter name" id="name" validationState="success" successText="Success" />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render error validation state', () => {
    const { toJSON } = renderWithTheme(
      <BaseInput label="Enter name" id="name" validationState="error" errorText="Error" />,
    );

    expect(toJSON()).toMatchSnapshot();
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
    const label = 'Enter name';
    const placeholder = 'First Last';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { getByPlaceholderText } = renderWithTheme(
      <BaseInput label={label} placeholder={placeholder} id="name" autoFocus />,
    );

    const input = getByPlaceholderText(placeholder);
    expect(input).toHaveFocus();
  });

  it('should be disabled when isDisabled flag is passed', () => {
    const label = 'Enter name';
    const { getByLabelText } = renderWithTheme(<BaseInput label={label} id="name" isDisabled />);

    const input = getByLabelText(label);
    expect(input).toBeDisabled();
  });

  it('should handle onChange', () => {
    const label = 'Enter name';
    const onChange = jest.fn();
    const userName = 'Divyanshu';

    const { getByLabelText } = renderWithTheme(
      <BaseInput label={label} id="name" name="name" onChange={onChange} />,
    );

    const input = getByLabelText(label);
    fireEvent.changeText(input, userName);

    // should be called for each keystroke
    expect(onChange).toHaveBeenCalledTimes(userName.length);
    expect(onChange).toHaveBeenLastCalledWith({ name: 'name', value: userName });
  });

  //   it('should handle onBlur', () => {
  //     const label = 'Enter name';
  //     const userName = 'Divyanshu';
  //     const onBlur = jest.fn();

  //     renderWithTheme(
  //       <BaseInput
  //         label={label}
  //         id="name"
  //         name="name"
  //         defaultValue={userName}
  //         // eslint-disable-next-line jsx-a11y/no-autofocus
  //         autoFocus
  //         onBlur={onBlur}
  //       />,
  //     );

  //     // shifts user focus and therefore blurs the focussed input
  //     fireEvent.
  //     expect(onBlur).toHaveBeenCalledTimes(1);
  //     expect(onBlur).toHaveBeenCalledWith({ name: 'name', value: userName });
  //   });

  //   it('should set value as an uncontrolled input', () => {
  //     const label = 'Enter name';
  //     const valueInitial = 'Divyanshu';
  //     const valueFinal = 'Divyanshu Maithani';

  //     const { getByLabelText } = renderWithTheme(
  //       <BaseInput label={label} id="name" defaultValue={valueInitial} />,
  //     );

  //     const input = getByLabelText(label);
  //     expect(input).toHaveValue(valueInitial);

  //     user.type(input, ' Maithani');
  //     expect(input).toHaveValue(valueFinal);
  //   });

  //   it('should set value as a controlled input', () => {
  //     const label = 'Enter name';
  //     const valueInitial = 'Divyanshu';
  //     const valueFinal = 'Divyanshu Maithani';

  //     const { getByLabelText, rerender } = renderWithTheme(
  //       <BaseInput label={label} id="name" value={valueInitial} />,
  //     );

  //     const input = getByLabelText(label);
  //     expect(input).toHaveValue(valueInitial);

  //     // simulate a controlled input by updating value prop
  //     rerender(
  //       <ThemeWrapper>
  //         <BaseInput label={label} id="name" value={valueFinal} />
  //       </ThemeWrapper>,
  //     );
  //     expect(getByLabelText(label)).toHaveValue(valueFinal);
  //   });

  //   it('should pass a11y', () => {
  //     const { getByRole } = renderWithTheme(
  //       <BaseInput
  //         label="Enter name"
  //         id="name"
  //         isRequired
  //         helpText="First name and last name"
  //         validationState="none"
  //       />,
  //     );

  //     const input = getByRole('textbox');
  //   });
});
