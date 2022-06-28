/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Subtitle, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs';
import { useState } from 'react';
import iconMap from '../../Icons/iconMap';
import { Text } from '../../Typography';
import type { BaseButtonProps } from './BaseButton';
import BaseButtonComponent from './BaseButton';

export default {
  title: 'Components/Button/BaseButton (Internal)',
  component: BaseButtonComponent,
  args: {
    variant: 'primary',
    children: 'Pay Now',
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
          <Subtitle>
            This is the BaseButton component. It is only for internal Blade usage.
          </Subtitle>
          <Title>Example</Title>
          <Primary />
          <Title>Properties</Title>
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
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

const ButtonLoadingExample = (args: any): React.ReactElement => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <BaseButtonComponent onClick={(): void => setLoading(!loading)}>
        Toggle loading
      </BaseButtonComponent>
      <Text>Open voice over (fn+⌘+F5) to hear loading state being announced</Text>
      <BaseButtonComponent
        {...args}
        onClick={(): void => setLoading(!loading)}
        isLoading={loading}
      />
    </>
  );
};

const BaseButtonLoadingTemplate: ComponentStory<typeof BaseButtonComponent> = ({
  icon,
  children,
  ...args
}) => {
  const IconComponent = iconMap[(icon as unknown) as string];
  return (
    <ButtonLoadingExample icon={IconComponent} {...args}>
      {children}
    </ButtonLoadingExample>
  );
};

export const BaseButton = BaseButtonTemplate.bind({});
export const BaseButtonAccessibleIcon = BaseButtonTemplate.bind({});
BaseButtonAccessibleIcon.args = {
  icon: 'CloseIcon' as any,
  children: undefined,
  accessibilityLabel: 'Close',
};
export const BaseButtonLoading = BaseButtonLoadingTemplate.bind({});

// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
BaseButton.storyName = 'BaseButton';
