import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { ReactElement } from 'react';
import type { IconButtonProps } from './IconButton';
import { IconButton as IconButtonComponent } from './IconButton';
import { CloseIcon, UserIcon, ArrowLeftIcon } from '~components/Icons';
import iconMap from '~components/Icons/iconMap';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getBladeCommonEventArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import BaseBox from '~components/Box/BaseBox';
import { Box } from '~components/Box';
import { Text, Heading } from '~components/Typography';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="IconButton"
      componentDescription="Useful for making clickable icons. For example - close button for modals, inputs, etc."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=71108-309592&t=ozxGdqCDqI9hRYY8-1&scaling=min-zoom&page-id=614%3A1&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
        import { IconButton, CloseIcon } from '@razorpay/blade/components';

        function App() {
          return (
            <IconButton 
              icon={CloseIcon} 
              accessibilityLabel="Close" 
              onClick={() => console.log('Clicked')} 
            />
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const meta: Meta<IconButtonProps> = {
  title: 'Components/IconButton',
  component: IconButtonComponent,
  args: {
    size: 'medium',
    emphasis: 'intense',
    accessibilityLabel: 'Close',
  },
  tags: ['autodocs'],
  argTypes: {
    ...getBladeCommonEventArgTypes(),
    onClick: { action: 'onClick' },
    icon: {
      name: 'icon',
      type: 'select' as 'string',
      options: Object.keys(iconMap),
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    emphasis: {
      control: 'select',
      options: ['intense', 'subtle', 'moderate'],
      description:
        'Icon emphasis. `moderate` = persistent faded background (AppBar trailing actions). `subtle` = static-white icon on dark surfaces.',
    },
    isHighlighted: {
      control: 'boolean',
      description:
        'Faded background on hover/focus only (web-only). Not valid with `size="large"`.',
    },
    isDisabled: {
      control: 'boolean',
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const IconButtonTemplate: StoryFn<typeof IconButtonComponent> = ({
  icon = 'CloseIcon',
  ...args
}) => {
  const IconComponent = iconMap[(icon as unknown) as string];

  return <IconButtonComponent icon={IconComponent} {...args} />;
};

export const IconButton = IconButtonTemplate.bind({});
IconButton.storyName = 'IconButton';

const sizes: IconButtonProps['size'][] = ['small', 'medium', 'large'];
const highlightedSizes: IconButtonProps['size'][] = ['small', 'medium'];

const sizeLabels: Record<string, string> = {
  small: '12px',
  medium: '16px',
  large: '20px',
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const EmphasisSection = ({
  emphasis,
  isSubtle,
}: {
  emphasis: Exclude<IconButtonProps['emphasis'], 'moderate'>;
  isSubtle: boolean;
}): ReactElement => {
  const textColor = isSubtle ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal';
  const mutedTextColor = isSubtle ? 'surface.text.staticWhite.muted' : 'surface.text.gray.muted';
  const emphasisLabel = emphasis === 'intense' ? 'Intense' : 'Subtle';

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      gap="spacing.5"
      padding="spacing.7"
      backgroundColor={isSubtle ? 'surface.background.primary.intense' : undefined}
      borderRadius="medium"
    >
      <Heading size="small" color={textColor}>
        Emphasis: {emphasisLabel}
      </Heading>

      {/* Column Headers */}
      <BaseBox display="flex" flexDirection="row" gap="spacing.8" alignItems="center">
        <Box width="100px" />
        <Box width="48px">
          <Text size="xsmall" weight="semibold" color={mutedTextColor}>
            Default
          </Text>
        </Box>
        <Box width="48px">
          <Text size="xsmall" weight="semibold" color={mutedTextColor}>
            Disabled
          </Text>
        </Box>
      </BaseBox>

      {/* Regular IconButton rows */}
      {sizes.map((size) => (
        <BaseBox key={size} display="flex" flexDirection="row" gap="spacing.8" alignItems="center">
          <Box width="100px">
            <Text size="xsmall" color={mutedTextColor}>
              Size {sizeLabels[size ?? 'medium']}
            </Text>
          </Box>
          <Box width="48px" display="flex" alignItems="center" justifyContent="center">
            <IconButtonComponent
              icon={CloseIcon}
              size={size}
              emphasis={emphasis}
              accessibilityLabel="Close"
              onClick={noop}
            />
          </Box>
          <Box width="48px" display="flex" alignItems="center" justifyContent="center">
            <IconButtonComponent
              icon={CloseIcon}
              size={size}
              emphasis={emphasis}
              accessibilityLabel="Close"
              onClick={noop}
              isDisabled
            />
          </Box>
        </BaseBox>
      ))}

      {/* Highlighted IconButton rows */}
      <BaseBox marginTop="spacing.3">
        <Text size="xsmall" weight="semibold" color={mutedTextColor}>
          Highlighted
        </Text>
      </BaseBox>
      {highlightedSizes.map((size) => (
        <BaseBox
          key={`highlighted-${size}`}
          display="flex"
          flexDirection="row"
          gap="spacing.8"
          alignItems="center"
        >
          <Box width="100px">
            <Text size="xsmall" color={mutedTextColor}>
              Size {sizeLabels[size ?? 'medium']}
            </Text>
          </Box>
          <Box width="48px" display="flex" alignItems="center" justifyContent="center">
            <IconButtonComponent
              icon={CloseIcon}
              size={size}
              emphasis={emphasis}
              accessibilityLabel="Close"
              onClick={noop}
              isHighlighted
            />
          </Box>
          <Box width="48px" display="flex" alignItems="center" justifyContent="center">
            <IconButtonComponent
              icon={CloseIcon}
              size={size}
              emphasis={emphasis}
              accessibilityLabel="Close"
              onClick={noop}
              isHighlighted
              isDisabled
            />
          </Box>
        </BaseBox>
      ))}
    </BaseBox>
  );
};

const ModerateSection = (): ReactElement => {
  const mutedTextColor = 'surface.text.staticWhite.muted';

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      gap="spacing.5"
      padding="spacing.7"
      backgroundColor="surface.background.primary.intense"
      borderRadius="medium"
    >
      <Heading size="small" color="surface.text.staticWhite.normal">
        Emphasis: Moderate
      </Heading>
      <Text size="small" color={mutedTextColor}>
        Fixed square container with faded background at rest. Used for AppBar profile and close
        actions.
      </Text>

      <BaseBox display="flex" flexDirection="row" gap="spacing.8" alignItems="center">
        <Box width="100px" />
        <Box width="96px">
          <Text size="xsmall" weight="semibold" color={mutedTextColor}>
            Default
          </Text>
        </Box>
        <Box width="96px">
          <Text size="xsmall" weight="semibold" color={mutedTextColor}>
            Disabled
          </Text>
        </Box>
      </BaseBox>

      {highlightedSizes.map((size) => (
        <BaseBox
          key={`moderate-${size}`}
          display="flex"
          flexDirection="row"
          gap="spacing.8"
          alignItems="center"
        >
          <Box width="100px">
            <Text size="xsmall" color={mutedTextColor}>
              Size {sizeLabels[size ?? 'medium']}
            </Text>
          </Box>
          <Box
            width="96px"
            display="flex"
            flexDirection="row"
            gap="spacing.3"
            alignItems="center"
            justifyContent="center"
          >
            <IconButtonComponent
              icon={UserIcon}
              size={size}
              emphasis="moderate"
              accessibilityLabel="Profile"
              onClick={noop}
            />
            <IconButtonComponent
              icon={CloseIcon}
              size={size}
              emphasis="moderate"
              accessibilityLabel="Close"
              onClick={noop}
            />
          </Box>
          <Box
            width="96px"
            display="flex"
            flexDirection="row"
            gap="spacing.3"
            alignItems="center"
            justifyContent="center"
          >
            <IconButtonComponent
              icon={UserIcon}
              size={size}
              emphasis="moderate"
              accessibilityLabel="Profile"
              onClick={noop}
              isDisabled
            />
            <IconButtonComponent
              icon={CloseIcon}
              size={size}
              emphasis="moderate"
              accessibilityLabel="Close"
              onClick={noop}
              isDisabled
            />
          </Box>
        </BaseBox>
      ))}
    </BaseBox>
  );
};

export const AllVariantsAndSizes: StoryFn<typeof IconButtonComponent> = () => {
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.7">
      <EmphasisSection emphasis="intense" isSubtle={false} />
      <EmphasisSection emphasis="subtle" isSubtle />
      <ModerateSection />
    </BaseBox>
  );
};

AllVariantsAndSizes.storyName = 'All Variants & Sizes';

export const AppBarUsage: StoryFn<typeof IconButtonComponent> = () => {
  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      gap="spacing.5"
      padding="spacing.7"
      borderRadius="medium"
      backgroundColor="#3669ff"
      maxWidth="375px"
    >
      <Heading size="small" color="surface.text.staticWhite.normal">
        App Bar Usage
      </Heading>
      <Text size="small" color="surface.text.staticWhite.muted">
        Back affordance uses `emphasis="subtle"`. Trailing profile and close use
        `emphasis="moderate"`.
      </Text>
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButtonComponent
          icon={ArrowLeftIcon}
          emphasis="subtle"
          size="medium"
          accessibilityLabel="Go back"
          onClick={noop}
        />
        <BaseBox display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
          <IconButtonComponent
            icon={UserIcon}
            emphasis="moderate"
            size="medium"
            accessibilityLabel="Profile"
            onClick={noop}
          />
          <IconButtonComponent
            icon={CloseIcon}
            emphasis="moderate"
            size="medium"
            accessibilityLabel="Close"
            onClick={noop}
          />
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

AppBarUsage.storyName = 'App Bar Usage';

export default meta;
