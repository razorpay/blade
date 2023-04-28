import { useController, useForm } from 'react-hook-form';
import {
  BladeProvider,
  Button,
  PasswordInput,
  TextArea,
  TextInput,
} from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';
import '@fontsource/lato/400.css';
import '@fontsource/lato/400-italic.css';
import '@fontsource/lato/700.css';
import '@fontsource/lato/700-italic.css';

type FormFields = {
  firstName: string;
  report: string;
  password: string;
};

function App(): JSX.Element {
  const { control, handleSubmit } = useForm<FormFields>({
    defaultValues: { firstName: 'Anu' },
  });

  const firstName = useController({
    name: 'firstName',
    control,
    rules: {
      required: true,
      minLength: 3,
    },
  });

  const report = useController({
    name: 'report',
    control,
    rules: {
      required: true,
      validate: (value) => {
        return !/bug/.exec(value);
      },
    },
  });

  const password = useController({
    name: 'password',
    control,
    rules: {
      required: true,
      minLength: 3,
      maxLength: 10,
    },
  });

  return (
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        <TextInput
          {...firstName.field}
          onChange={({ value }) => firstName.field.onChange(value)}
          value={firstName.field.value}
          ref={firstName.field.ref}
          label="First Name"
          necessityIndicator="required"
          validationState={firstName.fieldState.error ? 'error' : 'none'}
          errorText={
            firstName.fieldState.error?.type === 'minLength'
              ? 'First name needs to be atleast 3 character long'
              : 'First name is required'
          }
        />

        <TextArea
          {...report.field}
          onChange={({ value }) => report.field.onChange(value)}
          value={report.field.value}
          ref={report.field.ref}
          label="Bug Report"
          helpText="Report must not contain the word 'bug'"
          necessityIndicator="required"
          validationState={report.fieldState.error ? 'error' : 'none'}
          errorText={
            report.fieldState.error?.type === 'validate'
              ? "Report can't contain the word 'bug'"
              : 'Please explain your problem in detail'
          }
        />

        <PasswordInput
          {...password.field}
          onChange={({ value }) => password.field.onChange(value)}
          value={password.field.value}
          ref={password.field.ref}
          label="Password"
          necessityIndicator="required"
          validationState={password.fieldState.error ? 'error' : 'none'}
          errorText={
            password.fieldState.error?.type === 'minLength'
              ? 'Password must be atleast 3 character long'
              : password.fieldState.error?.type === 'maxLength'
              ? 'Password is too long!'
              : 'Password is required'
          }
        />

        <Button type="submit">submit</Button>
      </form>
    </BladeProvider>
  );
}

export default App;
