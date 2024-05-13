import type { StoryFn, Meta } from '@storybook/react';
import type { AvatarProps } from '../Avatar';
import { Avatar as AvatarComponent } from '../Avatar';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { BuildingIcon } from '~components/Icons';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import iconMap from '~components/Icons/iconMap';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Avatar"
      componentDescription="The Avatar component is used to group related buttons together."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=80753%3A108070&mode=design&t=iGYw4ygZL8cErFIL-1"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import {
          Button,
          Avatar,
          RefreshIcon,
          ShareIcon,
          DownloadIcon,
        } from '@razorpay/blade/components';
        
        function App(): React.ReactElement {
          return (
            <Avatar>
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
              <Button icon={DownloadIcon}>Download</Button>
            </Avatar>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Avatar/Avatar',
  component: AvatarComponent,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<AvatarProps>;

const AvatarTemplate: StoryFn<typeof AvatarComponent> = (args) => {
  return <AvatarComponent {...args} />;
};

export const Default = AvatarTemplate.bind({});
Default.storyName = 'Default';

const AvatarTypeTemplate: StoryFn<typeof AvatarComponent> = (args) => {
  const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
  return (
    <Box display="flex" flexDirection="row" gap="spacing.5">
      {sizes.map((size) => (
        <AvatarComponent key={size} {...args} size={size} />
      ))}
    </Box>
  );
};

export const ImageAvatars = AvatarTypeTemplate.bind({});
ImageAvatars.storyName = 'Image Avatars';
ImageAvatars.args = {
  src: 'https://avatars.githubusercontent.com/u/46647141?v=4',
  name: 'Nitin Kumar',
};

export const LetterAvatars = AvatarTypeTemplate.bind({});
LetterAvatars.storyName = 'Letter Avatars';
LetterAvatars.args = {
  name: 'Nitin Kumar',
};

export const IconAvatars = AvatarTypeTemplate.bind({});
IconAvatars.storyName = 'Icon Avatars';
IconAvatars.args = {
  icon: BuildingIcon,
  variant: 'square',
};

const AvatarSizesTemplate: StoryFn<typeof AvatarComponent> = (args) => {
  const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {sizes.map((size) => (
        <Box
          key={size}
          display="flex"
          flex="1 1 auto"
          alignItems="center"
          justifyItems="center"
          alignContent="center"
          gap="spacing.5"
          flexWrap="nowrap"
          width="120px"
        >
          <Box width="50px">
            <Heading>{size}</Heading>
          </Box>
          <Box display="flex" flex="1 1 auto" justifyContent="center">
            <AvatarComponent {...args} size={size} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const AllSizes = AvatarSizesTemplate.bind({});
AllSizes.storyName = 'All Sizes';

const AvatarColorsTemplate: StoryFn<typeof AvatarComponent> = (args) => {
  const colors = ['primary', 'positive', 'negative', 'neutral', 'notice', 'information'] as const;
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {colors.map((color) => (
        <Box
          key={color}
          display="flex"
          flex="1 1 auto"
          alignItems="center"
          justifyItems="center"
          alignContent="center"
          gap="spacing.5"
          flexWrap="nowrap"
          width="200px"
        >
          <Box width="40px">
            <Heading>{color}</Heading>
          </Box>
          <Box display="flex" flex="1 1 auto" justifyContent="center">
            <AvatarComponent size="medium" {...args} color={color} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const AllColors = AvatarColorsTemplate.bind({});
AllColors.storyName = 'All Colors';

const AvatarVariantsTemplate: StoryFn<typeof AvatarComponent> = (args) => {
  const variants = ['circle', 'square'] as const;
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {variants.map((variant) => (
        <Box
          key={variant}
          display="flex"
          flex="1 1 auto"
          alignItems="center"
          justifyItems="center"
          alignContent="center"
          gap="spacing.5"
          flexWrap="nowrap"
          width="120px"
        >
          <Box width="40px">
            <Heading>{variant}</Heading>
          </Box>
          <Box display="flex" flex="1 1 auto" justifyContent="center">
            <AvatarComponent size="medium" {...args} variant={variant} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const AllVariants = AvatarVariantsTemplate.bind({});
AllVariants.storyName = 'All Variants';

const AvatarDropdownTemplate: StoryFn<typeof AvatarComponent> = (args) => {
  return (
    <Dropdown>
      <AvatarComponent size="large" {...args} />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Payouts" value="payout" />
          <ActionListItem title="Transactions" value="transactions" />
          <ActionListItem title="Settings" value="settings" />
          <ActionListItem title="Logout" value="logout" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export const WithDropdown = AvatarDropdownTemplate.bind({});
WithDropdown.storyName = 'With Dropdown';
