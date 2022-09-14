import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Highlight, Link } from '@storybook/design-system';

import type { PasswordFieldProps } from './PasswordField';
import { PasswordField } from './PasswordField';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=10953%3A110176',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=10953%3A110176',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9995%3A180296',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9995%3A180296',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        Password Field is an input field for entering passwords. The input is masked by default. On
        mobile devices the last typed letter is shown for a brief moment. The masking can be toggled
        using an optional reveal button.
      </Subtitle>
      <Title>Usage</Title>
      <Link withArrow={true} href={figmaURL} target="_blank" rel="noreferrer noopener">
        View in Figma
      </Link>
      <Highlight language="tsx">{`import { PasswordField } from '@razorpay/blade/components' \nimport type { PasswordFieldProps } from '@razorpay/blade/components'`}</Highlight>
      <Title>Example</Title>
      <Subtitle>You can change the properties using the controls in the table below.</Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

const meta: Meta<PasswordFieldProps> = {
  title: 'Components/Input/PasswordField',
  component: PasswordField,
  args: {
    id: 'password',
    label: 'Enter password',
    helpText: 'We recommend setting a strong password',
  },
  argTypes: {},
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const PasswordFieldTemplate: ComponentStory<typeof PasswordField> = ({ ...args }) => {
  return <PasswordField {...args} />;
};

export const Default = PasswordFieldTemplate.bind({});

export const MaxCharacters = PasswordFieldTemplate.bind({});
MaxCharacters.args = {
  maxCharacters: 16,
};
MaxCharacters.parameters = {
  docs: {
    description: {
      story:
        '`maxCharacters` can be used to restrict the maximum permissible characters and show a character counter',
    },
  },
};

export const ErrorState = PasswordFieldTemplate.bind({});
ErrorState.args = {
  validationState: 'error',
  errorText: 'Error',
};
ErrorState.parameters = {
  docs: {
    description: {
      story:
        '`validationState` can be used to set an `error` state and an approriate hint can be passed with `errorText`',
    },
  },
};

export const SuccessState = PasswordFieldTemplate.bind({});
SuccessState.args = {
  validationState: 'success',
  successText: 'Success',
};
SuccessState.parameters = {
  docs: {
    description: {
      story:
        '`validationState` can be used to set a `success` state and an approriate hint can be passed with `successText`',
    },
  },
};

export const LabelAtLeft = PasswordFieldTemplate.bind({});
LabelAtLeft.args = {
  labelPosition: 'left',
};
LabelAtLeft.parameters = {
  docs: {
    description: {
      story: '`labelPosition` can be used to adjust the positioning of input label',
    },
  },
};

export default meta;
