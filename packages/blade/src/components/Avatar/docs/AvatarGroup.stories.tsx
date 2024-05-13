import type { StoryFn, Meta } from '@storybook/react';
import type { AvatarProps } from '../Avatar';
import { Avatar as AvatarComponent } from '../Avatar';
import { AvatarGroup as AvatarGroupComponent } from '../AvatarGroup';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import iconMap from '~components/Icons/iconMap';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="AvatarGroup"
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
  title: 'Components/Avatar/AvatarGroup',
  component: AvatarGroupComponent,
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

const AvatarGroupTemplate: StoryFn<typeof AvatarGroupComponent> = (args) => {
  const names = [
    'Anurag Hazra',
    'Kamlesh Chandnani',
    'Rama Krushna Behera',
    'Nitin Kumar',
    'Chaitanya Vikas Deorukhkar',
  ] as const;
  const colors = ['primary', 'positive', 'negative', 'information', 'notice'] as const;
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <AvatarGroupComponent {...args}>
        {names.map((name, index) => (
          <AvatarComponent key={name} name={name} color={colors[index]} />
        ))}
      </AvatarGroupComponent>
    </Box>
  );
};

export const Default = AvatarGroupTemplate.bind({});
Default.storyName = 'Default';

export const MaxCount = AvatarGroupTemplate.bind({});
MaxCount.storyName = 'Max Count';
MaxCount.args = {
  maxCount: 3,
  size: 'medium',
};

const AvatarGroupSizesTemplate: StoryFn<typeof AvatarGroupComponent> = (args) => {
  const names = [
    'Anurag Hazra',
    'Kamlesh Chandnani',
    'Rama Krushna Behera',
    'Nitin Kumar',
    'Chaitanya Vikas Deorukhkar',
  ] as const;
  const colors = ['primary', 'positive', 'negative', 'information', 'notice'] as const;
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
          width="250px"
        >
          <Box width="50px">
            <Heading>{size}</Heading>
          </Box>
          <Box display="flex" flex="1 1 auto" justifyContent="center">
            <AvatarGroupComponent {...args} size={size}>
              {names.map((name, index) => (
                <AvatarComponent key={name} name={name} color={colors[index]} />
              ))}
            </AvatarGroupComponent>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const AllSizes = AvatarGroupSizesTemplate.bind({});
AllSizes.storyName = 'All Sizes';
