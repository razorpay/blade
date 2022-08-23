import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import { Highlight } from '@storybook/design-system';
import React from 'react';
import type { BaseInputProps } from './BaseInput';
import { BaseInput as BaseInputComponent } from './BaseInput';
import iconMap from '~components/Icons/iconMap';
import { CloseIcon } from '~components/Icons';

export default {
  title: 'Components/Input/BaseInput (Internal)',
  component: BaseInputComponent,
  args: {
    id: 'base-input',
    defaultValue: undefined,
    placeholder: 'Enter your first and last name',
    name: 'fullName',
    type: 'text',
    isDisabled: false,
    value: undefined,
    maxCharacters: 9999,
    onChange: undefined,
    label: 'Enter Name',
    labelPosition: 'top',
    neccessityIndicator: undefined,
    isRequired: false,
    validationState: 'none',
    helpText: undefined,
    errorText: undefined,
    successText: undefined,
    leadingIcon: undefined,
    prefix: '',
    interactionElement: <CloseIcon size="medium" color="surface.text.subtle.lowContrast" />,
    suffix: '',
    trailingIcon: undefined,
  },
  argTypes: {
    id: {
      table: {
        category: 'Base Input Props',
      },
    },
    defaultValue: {
      table: {
        category: 'Base Input Props',
      },
    },
    placeholder: {
      table: {
        category: 'Base Input Props',
      },
    },
    name: {
      table: {
        category: 'Base Input Props',
      },
    },
    type: {
      table: {
        category: 'Base Input Props',
      },
    },
    isDisabled: {
      table: {
        category: 'Base Input Props',
      },
    },
    value: {
      table: {
        category: 'Base Input Props',
      },
    },
    maxCharacters: {
      control: { type: 'number' },
      table: {
        category: 'Base Input Props',
      },
    },
    onChange: {
      table: {
        category: 'Base Input Props',
      },
    },
    label: {
      table: {
        category: 'Label Props',
      },
    },
    labelPosition: {
      table: {
        category: 'Label Props',
      },
    },
    neccessityIndicator: {
      table: {
        category: 'Validation Props',
      },
    },
    isRequired: {
      table: {
        category: 'Validation Props',
      },
    },
    validationState: {
      table: {
        category: 'Validation Props',
      },
    },
    helpText: {
      table: {
        category: 'Validation Props',
      },
    },
    errorText: {
      table: {
        category: 'Validation Props',
      },
    },
    successText: {
      table: {
        category: 'Validation Props',
      },
    },
    leadingIcon: {
      name: 'leadingIcon',
      type: 'select',
      options: Object.keys(iconMap),
      table: {
        category: 'Leading Visual Props',
      },
    },
    prefix: {
      table: {
        category: 'Leading Visual Props',
      },
    },
    interactionElement: {
      table: {
        category: 'Trailing Visual Props',
      },
    },
    // interactionElement:{},
    suffix: {
      table: {
        category: 'Trailing Visual Props',
      },
    },
    trailingIcon: {
      name: 'trailingIcon',
      type: 'select',
      options: Object.keys(iconMap),
      table: {
        category: 'Trailing Visual Props',
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>
            The BaseInput component is a component that will be used as a base to build all the
            other input fields like TextInput, PasswordInput, CardInput, OTPInput
          </Subtitle>
          <Title>Usage</Title>
          <Highlight language="tsx">{`import { BaseText } from '@razorpay/blade/components' \nimport type { BaseTextProps } from '@razorpay/blade/components'`}</Highlight>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<BaseInputProps>;

const BaseInputTemplate: ComponentStory<typeof BaseInputComponent> = ({
  leadingIcon,
  trailingIcon,
  ...args
}) => {
  return (
    <BaseInputComponent
      {...args}
      leadingIcon={iconMap[(leadingIcon as unknown) as string]}
      trailingIcon={iconMap[(trailingIcon as unknown) as string]}
    />
  );
};

export const BaseInput = BaseInputTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
BaseInput.storyName = 'BaseInput';

export const BaseInputHelpText = BaseInputTemplate.bind({});
BaseInputHelpText.storyName = 'BaseInput with Help Text';
BaseInputHelpText.args = {
  helpText: 'Please enter first and last name',
};

export const BaseInputError = BaseInputTemplate.bind({});
BaseInputError.storyName = 'BaseInput with error';
BaseInputError.args = {
  validationState: 'error',
  errorText: 'Name is not valid',
};

export const BaseInputSuccess = BaseInputTemplate.bind({});
BaseInputSuccess.storyName = 'BaseInput with success';
BaseInputSuccess.args = {
  defaultValue: 'John Ives',
  validationState: 'success',
  successText: 'Name validated',
};

const UncontrolledBaseInputTemplate: ComponentStory<typeof BaseInputComponent> = () => {
  return (
    <BaseInput
      id="base-input"
      label="First Name"
      defaultValue="John Ives"
      name="fullName"
      onChange={({ name, value }): void => console.log({ name, value })}
    />
  );
};
export const UncontrolledBaseInput = UncontrolledBaseInputTemplate.bind({});

const ControlledBaseInputTemplate: ComponentStory<typeof BaseInputComponent> = () => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <BaseInput
      id="base-input"
      label="First Name"
      value={inputValue}
      name="fullName"
      onChange={({ name, value }): void => {
        console.log(`sending ${name}:${value} to analytics service`);
        setInputValue(value ?? '');
      }}
    />
  );
};
export const ControlledBaseInput = ControlledBaseInputTemplate.bind({});
