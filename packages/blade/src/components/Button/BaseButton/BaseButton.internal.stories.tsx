import type { ComponentStory, Meta } from '@storybook/react';
import type { BaseButtonProps } from './BaseButton';
import BaseButtonComponent from './BaseButton';
import iconMap from '~components/Icons/iconMap';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

export default {
  title: 'Components/Button/BaseButton (Internal)',
  component: BaseButtonComponent,
  args: {
    variant: 'primary',
    children: 'Pay Now',
    contrast: 'low',
    onClick: (): void => {
      console.log('clicked');
    },
    isDisabled: false,
    isLoading: false,
    size: 'medium',
    iconPosition: 'left',
    isFullWidth: false,
    type: 'button',
  },
  argTypes: {
    ...getStyledPropsArgTypes(),
    icon: {
      name: 'icon',
      options: Object.keys(iconMap),
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="This is the BaseButton component. It is only for internal Blade usage."
          componentName="BaseButton"
        />
      ),
    },
  },
} as Meta<BaseButtonProps>;

const BaseButtonTemplate: ComponentStory<typeof BaseButtonComponent> = ({
  icon,
  children,
  ...args
}) => {
  const IconComponent = iconMap[(icon as unknown) as string];
  return (
    <BaseButtonComponent icon={IconComponent} {...args}>
      {children}
    </BaseButtonComponent>
  );
};

export const BaseButton = BaseButtonTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
BaseButton.storyName = 'Default';
