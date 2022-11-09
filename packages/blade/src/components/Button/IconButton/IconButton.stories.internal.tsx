import type { ComponentStory, Meta } from '@storybook/react';
import type { ReactElement } from 'react';

import type { IconButtonProps } from './IconButton';
import IconButtonComponent from './IconButton';
import iconMap from '~components/Icons/iconMap';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Internal component - useful for making clickable icons. For example - close button for modals, inputs, etc."
      componentName="Internal IconButton"
    />
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
