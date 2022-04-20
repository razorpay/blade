import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import CreditCard from './CreditCard';

const CreditCardMeta: ComponentMeta<typeof CreditCard> = {
  title: 'Components/Icons/CreditCard',
  component: CreditCard,
};
export default CreditCardMeta;

const Basic: ComponentStory<typeof CreditCard> = (args) => <CreditCard {...args} />;

export const Primary = Basic.bind({});
