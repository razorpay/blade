import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { FloatingActionButton as FloatingActionButtonComponent } from './FloatingActionButton';
import type { FloatingActionButtonProps } from './types';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { PlusIcon, EditIcon, MessageSquareIcon } from '~components/Icons';
import { Alert } from '~components/Alert';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="FloatingActionButton"
      componentDescription="A persistent, elevated button anchored to the bottom of the viewport, used for the single most important action on a screen. Use it for one action only — it is not a replacement for Button."
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=125809-2463"
    >
      <Title>Usage</Title>
      <Alert
        color="information"
        title="Positioning"
        description="FloatingActionButton anchors itself to the viewport, so it does not need a wrapper to position it. On React Native it is absolutely positioned and automatically clears the bottom safe area, so mount it inside a parent that fills the screen. The stories below are pinned inside a demo surface so they stay next to their labels."
        isFullWidth
        isDismissible={false}
      />
      <Sandbox>
        {`
          import { FloatingActionButton, PlusIcon } from '@razorpay/blade/components';

          function App() {
            return (
              <FloatingActionButton
                icon={PlusIcon}
                onClick={() => console.log('Create payment')}
              >
                Create payment
              </FloatingActionButton>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/FloatingActionButton',
  component: FloatingActionButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    icon: {
      control: { disable: true },
    },
  },
  args: {
    icon: PlusIcon,
    children: 'Create payment',
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<FloatingActionButtonProps>;

/**
 * The button anchors itself to the viewport, which in a docs iframe means it
 * escapes its story and overlaps its neighbours. Zeroing every inset returns it
 * to normal flow so a matrix of variants can be laid out side by side.
 */
const inlineDemoProps = {
  position: 'relative',
  top: 'spacing.0',
  right: 'spacing.0',
  bottom: 'spacing.0',
  left: 'spacing.0',
} as const;

/**
 * A positioned surface that acts as the viewport for stories which do need to
 * demonstrate real anchoring.
 */
const DemoViewport = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <Box
    height="160px"
    borderRadius="medium"
    backgroundColor="surface.background.gray.moderate"
    overflow="hidden"
    position="relative"
  >
    {children}
  </Box>
);

const FloatingActionButtonTemplate: StoryFn<typeof FloatingActionButtonComponent> = (args) => (
  <DemoViewport>
    <FloatingActionButtonComponent {...args} position="absolute" />
  </DemoViewport>
);

export const Default = FloatingActionButtonTemplate.bind({});
Default.storyName = 'Default';

export const IconOnly = FloatingActionButtonTemplate.bind({});
IconOnly.storyName = 'Icon Only';
IconOnly.args = {
  children: undefined,
  accessibilityLabel: 'Create payment',
};

export const Colors = (): React.ReactElement => (
  <Box display="flex" flexDirection="column" gap="spacing.5">
    {(['primary', 'white', 'black'] as const).map((color) => (
      <Box key={color} display="flex" flexDirection="column" gap="spacing.3">
        <Text weight="semibold">{color}</Text>
        <Box
          padding="spacing.5"
          borderRadius="medium"
          backgroundColor={
            color === 'white'
              ? 'surface.background.primary.intense'
              : 'surface.background.gray.moderate'
          }
          display="flex"
          flexDirection="row"
          gap="spacing.5"
          alignItems="center"
        >
          <FloatingActionButtonComponent icon={EditIcon} color={color} {...inlineDemoProps}>
            Edit invoice
          </FloatingActionButtonComponent>
          <FloatingActionButtonComponent
            icon={EditIcon}
            color={color}
            accessibilityLabel="Edit invoice"
            {...inlineDemoProps}
          />
        </Box>
      </Box>
    ))}
  </Box>
);

export const States = (): React.ReactElement => (
  <Box display="flex" flexDirection="row" gap="spacing.5" alignItems="center" flexWrap="wrap">
    <FloatingActionButtonComponent icon={MessageSquareIcon} {...inlineDemoProps}>
      Default
    </FloatingActionButtonComponent>
    <FloatingActionButtonComponent icon={MessageSquareIcon} isLoading {...inlineDemoProps}>
      Loading
    </FloatingActionButtonComponent>
    <FloatingActionButtonComponent icon={MessageSquareIcon} isDisabled {...inlineDemoProps}>
      Disabled
    </FloatingActionButtonComponent>
  </Box>
);

export const Placement = (): React.ReactElement => (
  <Box display="flex" flexDirection="column" gap="spacing.5">
    {(['bottom-start', 'bottom', 'bottom-end'] as const).map((placement) => (
      <Box key={placement} display="flex" flexDirection="column" gap="spacing.3">
        <Text weight="semibold">{placement}</Text>
        <DemoViewport>
          <FloatingActionButtonComponent
            icon={PlusIcon}
            placement={placement}
            accessibilityLabel="Create payment"
            position="absolute"
          />
        </DemoViewport>
      </Box>
    ))}
  </Box>
);
