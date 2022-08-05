import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import type { BadgeProps } from './Badge';
import { Badge as BadgeComponent } from './Badge';
import iconMap from '~components/Icons/iconMap';

export default {
  title: 'Components/Badge',
  component: BadgeComponent,
  args: {
    children: 'Label',
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
      page: () => (
        <>
          <Title />
          <Subtitle>This is the Badge component.</Subtitle>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
} as Meta<BadgeProps>;

const BadgeTemplate: ComponentStory<typeof BadgeComponent> = ({ icon, children, ...args }) => {
  const IconComponent = iconMap[(icon as unknown) as string];
  return (
    <BadgeComponent icon={IconComponent} {...args}>
      {children}
    </BadgeComponent>
  );
};

export const Badge = BadgeTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Badge.storyName = 'Badge';
