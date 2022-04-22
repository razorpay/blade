import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import CreditCardIcon from './CreditCardIcon';

const CreditCardIconMeta: ComponentMeta<typeof CreditCardIcon> = {
  title: 'Components/Icons/CreditCard',
  component: CreditCardIcon,
};
export default CreditCardIconMeta;

const Basic: ComponentStory<typeof CreditCardIcon> = (args) => <CreditCardIcon {...args} />;

export const Primary = Basic.bind({});
