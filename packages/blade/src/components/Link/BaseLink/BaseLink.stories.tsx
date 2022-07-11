import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import iconMap from '../../Icons/iconMap';
import type { BaseLinkProps } from './BaseLink';
import BaseLinkComponent from './BaseLink';

export default {
  title: 'Components/Link/BaseLink',
  component: BaseLinkComponent,
  args: {
    children: 'Pay Now',
    onClick: (): void => {
      console.log('clicked');
    },
    isDisabled: false,
    href: 'https://calendar.google.com/',
    target: '_blank',
    contrast: 'low',
  },
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
    },
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

const BaseLinkTemplate: ComponentStory<typeof BaseLinkComponent> = ({
  icon,
  children,
  ...args
}) => {
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
