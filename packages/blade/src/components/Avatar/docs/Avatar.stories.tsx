import type { StoryFn, Meta } from '@storybook/react';
import type { AvatarProps } from '../Avatar';
import { Avatar as AvatarComponent } from '../Avatar';
import { AvatarGroup as AvatarGroupComponent } from '../AvatarGroup';
import { TrustedBadgeIcon } from '../TrustedBadgeIcon';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { BuildingIcon } from '~components/Icons';
import iconMap from '~components/Icons/iconMap';
import { Indicator } from '~components/Indicator';
import { Text } from '~components/Typography';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Avatar"
      componentDescription="An avatar component is a standardized visual representation of a user or entity. This reusable element, often manifesting as a profile picture, icon, or initials, facilitates user recognition and streamlines interface navigation."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=88229-1518352&m=dev"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { Avatar } from '@razorpay/blade/components';
        
        function App() {
          return (
            <Avatar name="Nitin Kumar" src="https://avatars.githubusercontent.com/u/46647141?v=4" />
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
      type: 'select' as string,
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

const InteractiveNonInteractiveTemplate: StoryFn<typeof AvatarComponent> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <Text>We can make the Avatar interactive by adding an onClick or setting the href prop</Text>
      <AvatarComponent href="https://razorpay.com" size="large" />
      <Text>If we omit these props, the avatar will render as a plain div element</Text>
      <AvatarComponent size="large" />
    </Box>
  );
};

export const InteractiveNonInteractive = InteractiveNonInteractiveTemplate.bind({});
InteractiveNonInteractive.storyName = 'Interactive and NonInteractive Avatar';

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

const AvatarWithAddonsTemplate: StoryFn<typeof AvatarComponent> = (args) => {
  const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {sizes.map((size) => (
        <Box key={size} width="100%" display="flex" gap="spacing.5">
          <AvatarComponent
            {...args}
            size={size}
            topAddon={<Indicator color="negative" />}
            bottomAddon={TrustedBadgeIcon}
          />
          <AvatarComponent
            {...args}
            variant="square"
            size={size}
            topAddon={<Indicator color="negative" />}
            bottomAddon={TrustedBadgeIcon}
          />
        </Box>
      ))}
    </Box>
  );
};

export const WithAddons = AvatarWithAddonsTemplate.bind({});
WithAddons.storyName = 'With Addons';

export const AvatarShowcase: StoryFn<typeof AvatarComponent> = () => {
  const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
  const colors = ['primary', 'positive', 'negative', 'neutral', 'notice', 'information'] as const;

  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {/* Variants - Circle & Square */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          Variants
        </Text>
        <Box display="flex" gap="spacing.5">
          <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.2">
            <AvatarComponent variant="circle" size="large" name="Anurag Hazra" />
            <Text size="small">Circle</Text>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.2">
            <AvatarComponent variant="square" size="large" name="Anurag Hazra" />
            <Text size="small">Square</Text>
          </Box>
        </Box>
      </Box>

      {/* All Sizes - Circle */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          Sizes - Circle Variant
        </Text>
        <Box display="flex" gap="spacing.5" alignItems="flex-end">
          {sizes.map((size) => (
            <Box
              key={size}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="spacing.2"
            >
              <AvatarComponent variant="circle" size={size} name="Anurag Hazra" />
              <Text size="small">{size}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* All Sizes - Square */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          Sizes - Square Variant
        </Text>
        <Box display="flex" gap="spacing.5" alignItems="flex-end">
          {sizes.map((size) => (
            <Box
              key={size}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="spacing.2"
            >
              <AvatarComponent variant="square" size={size} name="Anurag Hazra" />
              <Text size="small">{size}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* All Colors */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          Colors
        </Text>
        <Box display="flex" gap="spacing.5" flexWrap="wrap">
          {colors.map((color) => (
            <Box
              key={color}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="spacing.2"
            >
              <AvatarComponent size="large" color={color} name="Anurag Hazra" />
              <Text size="small">{color}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Image Avatars */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          Image Avatars
        </Text>
        <Box display="flex" gap="spacing.5" alignItems="flex-end">
          {sizes.map((size) => (
            <Box
              key={size}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="spacing.2"
            >
              <AvatarComponent
                size={size}
                src="https://avatars.githubusercontent.com/u/35374649?v=4"
                name="Nitin Kumar"
              />
              <Text size="small">{size}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Letter Avatars */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          Letter Avatars
        </Text>
        <Box display="flex" gap="spacing.5" alignItems="flex-end">
          {sizes.map((size) => (
            <Box
              key={size}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="spacing.2"
            >
              <AvatarComponent size={size} name="Nitin Kumar" />
              <Text size="small">{size}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Icon Avatars */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          Icon Avatars
        </Text>
        <Box display="flex" gap="spacing.5" alignItems="flex-end">
          {sizes.map((size) => (
            <Box
              key={size}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="spacing.2"
            >
              <AvatarComponent size={size} icon={BuildingIcon} variant="square" />
              <Text size="small">{size}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* With Addons - Circle */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          With Addons - Circle
        </Text>
        <Box display="flex" gap="spacing.5" alignItems="flex-end">
          {sizes.map((size) => (
            <Box
              key={size}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="spacing.2"
            >
              <AvatarComponent
                size={size}
                name="Anurag Hazra"
                topAddon={<Indicator color="positive" />}
                bottomAddon={TrustedBadgeIcon}
              />
              <Text size="small">{size}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* With Addons - Square */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          With Addons - Square
        </Text>
        <Box display="flex" gap="spacing.5" alignItems="flex-end">
          {sizes.map((size) => (
            <Box
              key={size}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="spacing.2"
            >
              <AvatarComponent
                size={size}
                name="Anurag Hazra"
                variant="square"
                topAddon={<Indicator color="negative" />}
                bottomAddon={TrustedBadgeIcon}
              />
              <Text size="small">{size}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Interactive Avatars */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          Interactive Avatars
        </Text>
        <Box display="flex" gap="spacing.5">
          <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.2">
            <AvatarComponent
              size="large"
              name="Clickable"
              onClick={() => console.log('Avatar clicked')}
            />
            <Text size="small">onClick</Text>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.2">
            <AvatarComponent size="large" name="Link" href="https://razorpay.com" target="_blank" />
            <Text size="small">href</Text>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.2">
            <AvatarComponent
              size="large"
              name="Selected"
              isSelected
              onClick={() => console.log('Selected clicked')}
            />
            <Text size="small">isSelected</Text>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.2">
            <AvatarComponent size="large" name="Static" />
            <Text size="small">Non-interactive</Text>
          </Box>
        </Box>
      </Box>

      {/* Combined - Image with Addons */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          Image with Addons
        </Text>
        <Box display="flex" gap="spacing.5" alignItems="flex-end">
          {sizes.map((size) => (
            <Box
              key={size}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="spacing.2"
            >
              <AvatarComponent
                size={size}
                src="https://avatars.githubusercontent.com/u/35374649?v=4"
                name="Nitin Kumar"
                topAddon={<Indicator color="positive" />}
                bottomAddon={TrustedBadgeIcon}
              />
              <Text size="small">{size}</Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Avatar Group */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          Avatar Group
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          {sizes.map((size) => (
            <Box key={size} display="flex" alignItems="center" gap="spacing.4">
              <Box width="60px">
                <Text size="small">{size}</Text>
              </Box>
              <AvatarGroupComponent size={size}>
                <AvatarComponent color="primary" name="Anurag Hazra" />
                <AvatarComponent color="positive" name="Kamlesh Chandnani" />
                <AvatarComponent color="negative" name="Rama Krushna" />
                <AvatarComponent color="information" name="Nitin Kumar" />
                <AvatarComponent color="notice" name="Chaitanya Deorukhkar" />
              </AvatarGroupComponent>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Avatar Group with Max Count */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          Avatar Group with Max Count
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Box display="flex" alignItems="center" gap="spacing.4">
            <Box width="100px">
              <Text size="small">maxCount=3</Text>
            </Box>
            <AvatarGroupComponent size="medium" maxCount={3}>
              <AvatarComponent color="primary" name="Anurag Hazra" />
              <AvatarComponent color="positive" name="Kamlesh Chandnani" />
              <AvatarComponent color="negative" name="Rama Krushna" />
              <AvatarComponent color="information" name="Nitin Kumar" />
              <AvatarComponent color="notice" name="Chaitanya Deorukhkar" />
            </AvatarGroupComponent>
          </Box>
          <Box display="flex" alignItems="center" gap="spacing.4">
            <Box width="100px">
              <Text size="small">maxCount=2</Text>
            </Box>
            <AvatarGroupComponent size="medium" maxCount={2}>
              <AvatarComponent color="primary" name="Anurag Hazra" />
              <AvatarComponent color="positive" name="Kamlesh Chandnani" />
              <AvatarComponent color="negative" name="Rama Krushna" />
              <AvatarComponent color="information" name="Nitin Kumar" />
              <AvatarComponent color="notice" name="Chaitanya Deorukhkar" />
            </AvatarGroupComponent>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

AvatarShowcase.storyName = 'Showcase - All Variants';
AvatarShowcase.parameters = {
  docs: {
    description: {
      story:
        'A comprehensive showcase of all Avatar variants including sizes, colors, image/letter/icon avatars, addons, interactive states, and AvatarGroup.',
    },
  },
};
