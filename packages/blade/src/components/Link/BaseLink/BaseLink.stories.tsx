import type { StoryFn, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { BaseLinkProps } from './BaseLink';
import BaseLinkComponent from './BaseLink';
import iconMap from '~components/Icons/iconMap';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

export default {
  title: 'Components/Link/BaseLink (Internal)',
  variant: 'anchor',
  component: BaseLinkComponent,
  args: {
    children: 'Pay Now',
    onClick: (event): void => {
      console.log('clicked', event);
    },
    href: 'https://github.com/razorpay/blade',
    target: '_blank',
    rel: 'noreferrer noopener',
    contrast: 'low',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
    },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: (): unknown => (
        <>
          <Title />
          <Subtitle>This is the internal BaseLink component.</Subtitle>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<BaseLinkProps>;

const BaseLinkTemplate: StoryFn<typeof BaseLinkComponent> = ({ icon, children, ...args }) => {
  const IconComponent = iconMap[(icon as unknown) as string];

  return (
    <BaseLinkComponent icon={IconComponent} {...args}>
      {children}
    </BaseLinkComponent>
  );
};

export const BaseLink = BaseLinkTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
BaseLink.storyName = 'BaseLink';
