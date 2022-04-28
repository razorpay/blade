import type { ComponentType } from 'react';
import type { ComponentStory, Meta } from '@storybook/react';
import { IconNames, Icons } from './iconMap';
import type { IconProps } from '.';

export default {
  title: 'Components/Icons',
  args: {
    color: 'feedback.icon.neutral.lowContrast',
    size: 'medium',
  },
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      options: IconNames,
    },
  },
} as Meta<IconProps>;

const IconTemplate: ComponentStory<ComponentType<IconProps & { icon: string }>> = ({
  icon,
  ...args
}) => {
  const IconComponent = Icons[icon];
  return <IconComponent {...args} />;
};

export const Icon = IconTemplate.bind({});
Icon.args = {
  icon: 'CreditCardIcon',
};
