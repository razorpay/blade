import type { ComponentStory, Meta } from '@storybook/react';
import type { IconProps } from '..';
import CreditCardIconComponent from './CreditCardIcon';

export default {
  title: 'Components/Icons/CreditCardIcon',
  component: CreditCardIconComponent,
  args: {
    color: 'feedback.icon.neutral.lowContrast',
    size: 'medium',
  },
} as Meta<IconProps>;

const CreditCardIconTemplate: ComponentStory<typeof CreditCardIconComponent> = (args) => {
  return <CreditCardIconComponent {...args} />;
};

export const CreditCardIcon = CreditCardIconTemplate.bind({});
