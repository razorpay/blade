# Integrating Blade Components With Form Libraries

This guide will help you integrate blade components components like `TextInput`, `TextArea`, `OTPInput`, `DatePicker`, etc with various form libraries.

We will show how to integrate blade components with two most popular form libraries: 

1. [react-hook-from](https://react-hook-form.com/)
2. [Formik](https://formik.org/)

Stackblitz code samples: 

1. [react-hook-form-blade-integration](https://stackblitz.com/edit/mcff5a?file=App.tsx)
2. [formik-blade-integration](https://stackblitz.com/edit/mcff5a-7lqawv?file=App.tsx)

# React Hook Form

## Basic Example

### With `useController`

This is a basic example showing how to integrate `TextInput` with react-hook-form's [`useController`](https://react-hook-form.com/docs/usecontroller) hook.

```jsx
import {
  Button,
  TextInput,
} from '@razorpay/blade/components';
import { useForm, SubmitHandler, useController } from 'react-hook-form';

type Inputs = {
  firstName: string;
};

function BasicExample() {
  const { handleSubmit, control, formState } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    console.log(formData)
  };

  const firstName = useController({
    name: 'firstName',
    control,
    rules: {
      required: {
        message: 'First name needs to be atleast 3 character long',
        value: true,
      },
      minLength: {
        value: 3,
        message: 'First name needs to be atleast 3 character long',
      },
    },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="First Name"
        name={firstName.field.name}
        value={firstName.field.value}
        onChange={({ value }) => firstName.field.onChange(value)}
        ref={firstName.field.ref}
        necessityIndicator="optional"
        validationState={formState.errors.firstName ? 'error' : 'none'}
        errorText={formState.errors.firstName?.message}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

### With `<Controller />`

You can also use the [`<Controller />`](https://react-hook-form.com/docs/usecontroller/controller) component exposed from react-hook-form to integrate. 

```jsx
import {
  Button,
  TextInput,
} from '@razorpay/blade/components';
import { useForm, SubmitHandler, useController } from 'react-hook-form';

type Inputs = {
  firstName: string;
};

function BasicExample() {
  const { handleSubmit, control, formState } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (formData) => {
    console.log(formData)
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="firstName"
        control={control}
        rules={{
          required: {
            message: 'First name needs to be atleast 3 character long',
            value: true,
          },
          minLength: {
            value: 3,
            message: 'First name needs to be atleast 3 character long',
          },
        }}
        render={({ field, fieldState }) => {
          return (
            <TextInput
              name={field.name}
              value={field.value}
              onChange={({ value }) => field.onChange(value)}
              ref={field.ref}
              label="First Name"
              necessityIndicator={'optional'}
              validationState={fieldState.error ? 'error' : 'none'}
              errorText={fieldState.error?.message}
            />
          );
        }}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

### Composition And Abstraction

Although you can inline the `useController` hook directly within your form, creating a reusable `TextInput` component that wraps Blade's `TextInput` and integrates with react-hook-form can make your code easier to manage and reuse.

```tsx
// ReusableTextInput.tsx
import { TextInput, TextInputProps } from '@razorpay/blade/components';
import { useController, UseControllerProps, FieldValues } from 'react-hook-form';

type TextInputReusableProps<T extends FieldValues> = Omit<
  TextInputProps,
  'value' | 'onChange' | 'ref' | 'validationState' | 'errorText'
> &
  UseControllerProps<T>;

const TextInputReusable = <T extends FieldValues>({
  name,
  control,
  rules,
  ...props
}: TextInputReusableProps<T>) => {
  const controller = useController({
    name,
    control,
    rules,
    disabled: props.isDisabled,
  });

  return (
    <TextInput
      {...props}
      label={props.label!}
      ref={controller.field.ref}
      name={controller.field.name}
      value={controller.field.value}
      onChange={({ value }) => controller.field.onChange(value)}
      validationState={controller.fieldState.error ? 'error' : 'none'}
      errorText={controller.fieldState.error?.message}
    />
  );
};

export { TextInputReusable }

// App.tsx
import { TextInputReusable } from './TextInputReusable';
import { useForm, SubmitHandler, useController } from 'react-hook-form';

type Inputs = { firstName: string, lastName: string };

function Example() {
  const { handleSubmit, control } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <TextInputReusable
        control={control}
        name="firstName"
        label="Last Name"
        rules={{
          required: 'Please enter first name',
          minLength: {
            value: 3,
            message: 'First name needs to be atleast 3 character long',
          },
        }}
      />
      <TextInputReusable
        control={control}
        name="lastName"
        label="Last Name"
        rules={{ required: 'Please enter last name' }}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default Example;
```

### Radio

To integrate Blade's `Radio` components with `react-hook-form`, you can follow the example below. It demonstrates how to create a form that includes a radio button group for selecting gender.

```jsx
import {
  RadioGroup,
  Radio,
  Button,
} from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import { useForm, SubmitHandler, useController } from 'react-hook-form';

type Inputs = {
  gender: 'male' | 'female' | 'other';
};

function Example() {
  const { handleSubmit, control } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const gender = useController({
    name: 'gender',
    control,
    rules: { required: 'Please select your gender' },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <RadioGroup
        label="Gender"
        name={gender.field.name}
        value={gender.field.value}
        onChange={({ value }) => gender.field.onChange(value)}
        validationState={formState.errors.gender ? 'error' : 'none'}
        errorText={formState.errors.gender?.message}
      >
        <Radio value="male">Male</Radio>
        <Radio value="female">Female</Radio>
        <Radio value="other">Other</Radio>
      </RadioGroup>
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default Example;
```

### Checkbox

Here’s an example that integrates Blade's `Checkbox` and `CheckboxGroup` components with `react-hook-form` to allow multiple color selections:

```jsx
import {
  CheckboxGroup,
  Checkbox,
  Button,
} from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import { useForm, SubmitHandler, useController } from 'react-hook-form';

type Inputs = {
  colors: ('red' | 'green' | 'blue')[];
};

function Example() {
  const { handleSubmit, control, formState } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const colors = useController({
    name: 'colors',
    control,
    rules: { required: 'Please select at least one color' },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <CheckboxGroup
        label="Choose colors"
        name={colors.field.name}
        value={colors.field.value}
        onChange={({ values }) => colors.field.onChange(values)}
        validationState={formState.errors.colors ? 'error' : 'none'}
        errorText={formState.errors.colors?.message}
      >
        <Checkbox value="red">Red</Checkbox>
        <Checkbox value="green">Green</Checkbox>
        <Checkbox value="blue">Blue</Checkbox>
      </CheckboxGroup>
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default Example;
```

### OTPInput

This example shows how to integrate Blade's `OTPInput` component with `react-hook-form`, typically used for handling one-time password entries:

```jsx
import {
  OTPInput,
  Button,
} from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import { useForm, SubmitHandler, useController } from 'react-hook-form';

type Inputs = {
  otp: string;
};

function Example() {
  const { handleSubmit, control, formState } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const otp = useController({
    name: 'otp',
    control,
    rules: { 
      required: 'OTP is required',
      minLength: { value: 6, message: 'OTP must be 6 digits' },
    },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <OTPInput
          label="OTP"
          name={otp.field.name}
          value={otp.field.value}
          onChange={({ value }) => otp.field.onChange(value)}
          ref={(refs) => {
            // Focus on the first OTP field
            if (!refs) return;
            otp.field.ref(refs[0]);
          }}
          validationState={formState.errors.otp ? 'error' : 'none'}
          errorText={formState.errors.otp?.message}
        />
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default Example;
```

### DatePicker

Below is an example that shows how to integrate Blade's `DatePicker` component with `react-hook-form` to handle single date selection:

```jsx
import {
  DatePicker,
  Button,
} from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import { useForm, SubmitHandler, useController } from 'react-hook-form';

type Inputs = {
  date: Date;
};

function Example() {
  const { handleSubmit, control, formState } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const date = useController({
    name: 'date',
    control,
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <DatePicker
        label="Select a Date"
        name={date.field.name}
        value={date.field.value}
        onChange={(value) => date.field.onChange(value)}
        validationState={formState.errors.date ? 'error' : 'none'}
        errorText={formState.errors.date?.message}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default Example;
```

### Range DatePicker

Finally, here’s an example demonstrating how to integrate Blade's `DatePicker` with range selection enabled, using `react-hook-form`:

```jsx
import {
  Box,
  Button,
} from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import React from 'react';
import { useForm, SubmitHandler, useController } from 'react-hook-form';

type Inputs = {
  dateRange: [Date, Date];
};

function Example() {
  const { handleSubmit, control, formState } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const dateRange = useController({
    name: 'dateRange',
    control,
    defaultValue: [new Date(), new Date()],
    rules: {
      validate: {
        start: (value) => {
          if (value[0]?.getDate()! < new Date().getDate()) {
            return 'Start date cannot be less than today';
          }
        },
        end: (value) => {
          if (value[1]?.getMonth()! > new Date().getMonth()) {
            return 'End date cannot exceed this month';
          }
        },
      },
    },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <DatePicker
        selectionType="range"
        label={{ start: 'Select Date Range' }}
        name={{ start: dateRange.field.name, end: dateRange.field.name }}
        value={dateRange.field.value}
        onChange={(value) => dateRange.field.onChange(value)}
        validationState={formState.errors.dateRange ? 'error' : 'none'}
        errorText={{
          start:
            formState.errors.dateRange?.type === 'start'
              ? formState.errors.dateRange.message!
              : '',
          end:
            formState.errors.dateRange?.type === 'end'
              ? formState.errors.dateRange.message!
              : '',
        }}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default Example;
```

These examples demonstrate how to fully integrate various Blade components with `react-hook-form`, giving you a solid foundation to build complex, interactive forms with ease.

# Formik

## Basic Formik Example

Similar to react-hook-form you can also do the same with `Formik` with the help for Formik's `Field` or `useField` utilities you can integrate Blade components with Formik.


Here's a basic formik form with Blade's TextInput component, with yup schema validation:

```tsx
import { BladeProvider, Button, TextInput } from '@razorpay/blade/components';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(3, 'First name cannot be less than 3 chars'),
});

function Example() {
  return (
    <Formik<{ firstName: string }>
      initialValues={{ firstName: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          <Field name="firstName">
            {({ field, form }) => {
              return (
                <TextInput
                  label="First Name"
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={({ value }) => setFieldValue('firstName', value)}
                  validationState={
                    form.touched && form.errors.firstName ? 'error' : 'none'
                  }
                  errorText={form.errors.firstName}
                />
              );
            }}
          </Field>
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
}
```
