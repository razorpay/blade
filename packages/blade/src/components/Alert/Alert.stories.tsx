import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Highlight } from '@storybook/design-system';

import type { AlertProps } from './Alert';
import AlertComponent from './Alert';
import iconMap from '~components/Icons/iconMap';

const Page = (): ReactElement => {
  return (
    <>
      <Title />
      <Subtitle>
        Useful for making clickable icons. For example - close button for modals, inputs, etc.
      </Subtitle>
      <Title>Usage</Title>
      <Highlight language="tsx">{`import { Alert } from '@razorpay/blade/components' \nimport type { AlertProps } from '@razorpay/blade/components'`}</Highlight>
      <Title>Example</Title>
      <Subtitle>
        You can change the properties of this button using the controls in the table below.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

const meta: Meta<AlertProps> = {
  title: 'Components/Button/Alert (Internal)',
  component: AlertComponent,
  args: {
    size: 'medium',
    contrast: 'low',
    accessibilityLabel: 'Close',
  },
  argTypes: {
    onClick: { action: 'onClick' },
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const IconButtonTemplate: ComponentStory<typeof AlertComponent> = ({
  icon = 'CloseIcon',
  ...args
}) => {
  const IconComponent = iconMap[(icon as unknown) as string];

  return <AlertComponent icon={IconComponent} {...args} />;
};

export const Alert = IconButtonTemplate.bind({});
Alert.storyName = 'Alert';

export default meta;
