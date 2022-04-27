import type { ComponentStory, Meta } from '@storybook/react';
import CreditCardIconComponent from './CreditCardIcon';
import type { IconProps } from '.';

const Icons: Record<string, React.FC<IconProps>> = {
  CreditCardIcon: CreditCardIconComponent,
};

const IconNames = Object.keys(Icons);

export default {
  title: 'Components/Icons',
  component: CreditCardIconComponent,
  args: {
    color: 'feedback.icon.neutral.lowContrast',
    size: 'medium',
  },
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      defaultValue: 'CreditCardIcon',
      options: IconNames,
    },
  },
} as Meta<IconProps>;

const IconTemplate: ComponentStory<React.ComponentType<IconProps & { icon: string }>> = ({
  icon,
  ...args
}): React.ReactElement => {
  const IconComponent = Icons[icon];
  return <IconComponent {...args} />;
};

export const Icon = IconTemplate.bind({});
