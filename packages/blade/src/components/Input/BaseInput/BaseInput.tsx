/**
 * <TextInput
  label="Enter Name"
  labelPosition="left"
  placeholder="Enter your name"
  icon={UserIcon}
  showClearButton
  helpText="Enter first name and last name. Eg: Kamlesh Chandnani"
  errorText="Name cannot be blank"
  successText="Name validated"
  validationState={inputValue.length < 10 ? 'error' : 'success'}
/>
 */

import type { ReactElement } from 'react';
import { StyledBaseInput } from './StyledBaseInput';

type HandleOnChange = ({
  event,
  inputName,
  value,
}: {
  event?: React.ChangeEvent<HTMLInputElement>;
  inputName?: string;
  value?: string;
}) => void;

type OnChange = ({
  event,
  name,
  value,
}: {
  event?: React.ChangeEvent<HTMLInputElement>;
  name?: string;
  value?: string;
}) => void;

type LabelProps = {
  label: string;
  /**
   * Desktop only prop. on Mobile by default the label will be on top
   */
  labelPosition?: 'top' | 'left';
};

export type BaseInputProps = LabelProps & {
  /**
   * Placeholder text to be displayed inside the input field
   */
  placeholder?: string;
  /**
   * Type of Input Field to be rendered.
   *
   * @default text
   */
  type?: 'text' | 'telephone' | 'email' | 'url' | 'numeric' | 'search';
  /**
   * Used to set the default value of input field when it's uncontrolled
   */
  defaultValue?: string;
  /**
   * The name of the input field.
   *
   * Useful in form submissions
   */
  name?: string;
  /**
   * The callback function to be invoked when the value of the input field changes
   */
  onChange?: OnChange;
};

export const BaseInput = ({
  label,
  labelPosition = 'top',
  placeholder,
  type = 'text',
  defaultValue,
  name,
  onChange,
}: BaseInputProps): ReactElement => {
  console.log({
    label,
    labelPosition,
  });

  const handleOnChange: HandleOnChange = ({ event, inputName, value }) => {
    console.log({ event, name: inputName, value: event?.target.value });
    onChange?.({ event, name: inputName, value });
  };

  return (
    <StyledBaseInput
      name={name}
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={(event) => handleOnChange({ event, inputName: name, value: '' })}
    />
  );
};
