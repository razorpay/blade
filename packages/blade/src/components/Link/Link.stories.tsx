import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import iconMap from '../Icons/iconMap';
import type { LinkProps } from './Link';
import LinkComponent from './Link';

export default {
  title: 'Components/Link',
  component: LinkComponent,
  args: {
    children: 'Pay Now',
    onClick: (): void => {
      console.log('clicked');
    },
    isDisabled: false,
    href: 'https://calendar.google.com/',
    target: '_blank',
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
          <Subtitle>This is the Link component.</Subtitle>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<LinkProps>;

const LinkTemplate: ComponentStory<typeof LinkComponent> = ({ icon, children, ...args }) => {
  const IconComponent = iconMap[(icon as unknown) as string];

  return (
    <LinkComponent icon={IconComponent} {...args}>
      {children}
    </LinkComponent>
  );
};

export const Link = LinkTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Link.storyName = 'Link';
