import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Highlight } from '@storybook/design-system';

import type { IconButtonProps } from './IconButton';
import IconButtonComponent from './IconButton';
import iconMap from '~components/Icons/iconMap';

const Page = (): ReactElement => {
  return (
    <>
      <Title />
      <Subtitle>
        Useful for making clickable icons. For example - close button for modals, inputs, etc.
      </Subtitle>
      <Title>Usage</Title>
      <Highlight language="tsx">{`import { IconButton } from '@razorpay/blade/components' \nimport type { IconButtonProps } from '@razorpay/blade/components'`}</Highlight>
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

const meta: Meta<IconButtonProps> = {
  title: 'Components/Button/IconButton (Internal)',
  component: IconButtonComponent,
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

const IconButtonTemplate: ComponentStory<typeof IconButtonComponent> = ({
  icon = 'CloseIcon',
  ...args
}) => {
  const IconComponent = iconMap[(icon as unknown) as string];

  return <IconButtonComponent icon={IconComponent} {...args} />;
};

export const IconButton = IconButtonTemplate.bind({});
IconButton.storyName = 'IconButton';

export default meta;
