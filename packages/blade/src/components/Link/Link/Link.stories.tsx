import type { ComponentStory, Meta } from '@storybook/react';
import {
  Title,
  Subtitle,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
  Description,
} from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Highlight, Link as StorybookLink } from '@storybook/design-system';
import type { LinkProps } from './Link';
import LinkComponent from './Link';
import iconMap from '~components/Icons/iconMap';
import { InfoIcon } from '~components/Icons';
import { BaseText } from '~components/Typography/BaseText';
import Box from '~components/Box';
import useMakeFigmaURL from '~src/_helpers/storybook/useMakeFigmaURL';
import { Text } from '~components/Typography';

const Page = (): ReactElement => {
  const figmaURL = useMakeFigmaURL([
    {
      themeTokenName: 'paymentTheme',
      lightModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=12699%3A147155',
      darkModeURL:
        'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=12699%3A147155',
    },
    {
      themeTokenName: 'bankingTheme',
      lightModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10564%3A195587',
      darkModeURL:
        'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10564%3A195587',
    },
  ]);

  return (
    <>
      <Title />
      <Subtitle>
        This is the Link component which can be used for showing external or internal Links to the
        user. The Link component can also be used as an inline button in certain cases with the
        `button` variant
      </Subtitle>
      <StorybookLink withArrow={true} href={figmaURL} target="_blank" rel="noreferrer noopener">
        View in Figma
      </StorybookLink>
      <br />
      <br />
      <Title>Usage</Title>
      <Highlight language="tsx">{`import { Link } from '@razorpay/blade/components' \nimport type { LinkProps } from '@razorpay/blade/components'`}</Highlight>
      <Description markdown="> **Note:** While using the `Link` component with React Native, please ensure you have gone through platform-specific prerequisites like adding `LSApplicationQueriesSchemes` in `Info.plist` for iOS and adding `intent` queries in `AndroidManifest.xml` for Android. For a detailed guide, follow React Native's [Linking Documentation](https://reactnative.dev/docs/linking#canopenurl)." />
      <Title>Example</Title>
      <Subtitle>
        This is the default Link. You can change the properties of this Link using the controls in
        the table below.
      </Subtitle>
      <Primary />
      <Title>Properties</Title>
      <ArgsTable story={PRIMARY_STORY} />
      <Stories />
    </>
  );
};

export default {
  title: 'Components/Link',
  component: LinkComponent,
  args: {
    children: 'Learn More',
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
      page: Page,
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

export const Default = LinkTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Default';
Default.args = {
  variant: 'anchor',
  children: 'Learn More',
  onClick: (event): void => {
    console.log('clicked', event);
  },
  href: 'https://github.com/razorpay/blade',
  target: '_blank',
  rel: 'noreferrer noopener',
};

const LinkInlineTemplate: ComponentStory<typeof LinkComponent> = ({
  icon,
  children = '',
  ...args
}) => {
  return (
    <Text>
      Find more details at the <LinkComponent {...args}>{children}</LinkComponent>.
    </Text>
  );
};

export const LinkInline = LinkInlineTemplate.bind({});
LinkInline.storyName = 'Link - Inline';
LinkInline.args = {
  variant: 'anchor',
  href: 'https://github.com/razorpay/blade/',
  target: '_blank',
  rel: 'noreferrer noopener',
  children: `Blade's Github`,
};
LinkInline.parameters = {
  docs: {
    description: {
      story: 'Inline Link within a Text component',
    },
  },
};

export const LinkButton = LinkTemplate.bind({});
LinkButton.storyName = 'Link Button';
LinkButton.args = {
  variant: 'button',
  type: 'submit',
};
LinkButton.parameters = {
  docs: {
    description: {
      story: 'Link as an inline button',
    },
  },
};

const LinkButtonInlineTemplate: ComponentStory<typeof LinkComponent> = ({
  icon,
  children = '',
  ...args
}) => {
  return (
    <Text>
      Forgot Password? <LinkComponent {...args}>{children}</LinkComponent>
    </Text>
  );
};

export const LinkButtonInline = LinkButtonInlineTemplate.bind({});
LinkButtonInline.storyName = 'Link Button - Inline';
LinkButtonInline.args = {
  variant: 'button',
  children: 'Reset Password',
};
LinkButtonInline.parameters = {
  docs: {
    description: {
      story: 'Inline Link Button within a Text component',
    },
  },
};

export const DisabledLinkButton = LinkTemplate.bind({});
DisabledLinkButton.storyName = 'Link Button - Disabled';
DisabledLinkButton.args = {
  variant: 'button',
  isDisabled: true,
};
DisabledLinkButton.parameters = {
  docs: {
    description: {
      story: 'Link Button in a disabled state',
    },
  },
};

const LinkWithVariantTemplate: ComponentStory<typeof LinkComponent> = ({
  children = 'Link',
  icon,
  iconPosition,
}) => {
  return (
    <>
      <Box paddingBottom="spacing.3">
        <BaseText fontWeight="bold">Anchor</BaseText>
      </Box>
      <LinkComponent
        icon={icon}
        iconPosition={iconPosition}
        variant="anchor"
        href="https://github.com/razorpay/blade"
        target="_blank"
        rel="noreferrer noopener"
      >
        {children}
      </LinkComponent>
      <Box paddingTop="spacing.4" paddingBottom="spacing.3">
        <BaseText fontWeight="bold">Button</BaseText>
      </Box>
      <LinkComponent icon={icon} iconPosition={iconPosition} variant="button">
        {children}
      </LinkComponent>
    </>
  );
};

export const IconLeftLinkButton = LinkWithVariantTemplate.bind({});
IconLeftLinkButton.storyName = 'Left Icon';
IconLeftLinkButton.args = {
  iconPosition: 'left',
  icon: InfoIcon,
};
IconLeftLinkButton.parameters = {
  docs: {
    description: {
      story: '`anchor` & `button` variants of Link with an Icon on Left',
    },
  },
};

export const IconRightLinkButton = LinkWithVariantTemplate.bind({});
IconRightLinkButton.storyName = 'Right Icon';
IconRightLinkButton.args = {
  icon: InfoIcon,
  iconPosition: 'right',
};
IconRightLinkButton.parameters = {
  docs: {
    description: {
      story: '`anchor` & `button` variants of Link with an Icon on Right',
    },
  },
};

export const IconOnlyLinkButton = LinkWithVariantTemplate.bind({});
IconOnlyLinkButton.storyName = 'Icon Only';
IconOnlyLinkButton.args = {
  icon: InfoIcon,
  children: '',
};
IconOnlyLinkButton.parameters = {
  docs: {
    description: {
      story: '`anchor` & `button` variants of Link with only an Icon',
    },
  },
};
