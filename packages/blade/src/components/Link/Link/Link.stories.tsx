import type { StoryFn, Meta } from '@storybook/react';
import { Title, Description } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { LinkProps } from './Link';
import LinkComponent from './Link';
import iconMap from '~components/Icons/iconMap';
import { DownloadIcon, InfoIcon } from '~components/Icons';
import { BaseText } from '~components/Typography/BaseText';
import BaseBox from '~components/Box/BaseBox';
import { Heading, Text } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import {
  getBladeCommonEventArgTypes,
  getStyledPropsArgTypes,
} from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Link"
      componentDescription="This is the Link component which can be used for showing external or internal Links to the user. The Link component can also be used as an inline button in certain cases with the `button` variant"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=80952-9051&t=ozxGdqCDqI9hRYY8-1&scaling=min-zoom&page-id=614%3A1&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Link } from '@razorpay/blade/components';

          function App() {
            return (
              <Link 
                href="https://razorpay.com" 
                target="_blank" 
                rel="noopener noreferer"
              >
                Go to Razorpay.com
              </Link>
            )
          }

          export default App;
        `}
      </Sandbox>
      <Description markdown="> **Note** <br/>While using the `Link` component with React Native, please ensure you have gone through platform-specific prerequisites like adding `LSApplicationQueriesSchemes` in `Info.plist` for iOS and adding `intent` queries in `AndroidManifest.xml` for Android. For a detailed guide, follow React Native's [Linking Documentation](https://reactnative.dev/docs/linking#canopenurl)." />
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Link',
  component: LinkComponent,
  args: {
    children: 'Learn More',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
    },
    ...getStyledPropsArgTypes(),
    ...getBladeCommonEventArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<LinkProps>;

const LinkTemplate: StoryFn<typeof LinkComponent> = ({ children = 'Learn More', ...args }) => {
  return <LinkComponent {...args}>{children}</LinkComponent>;
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

const LinkInlineTemplate: StoryFn<typeof LinkComponent> = ({ icon, children = '', ...args }) => {
  return (
    <Text>
      Find more details at the <LinkComponent {...args}>{children}</LinkComponent>
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
};
LinkButton.parameters = {
  docs: {
    description: {
      story: 'Link as an inline button',
    },
  },
};

const LinkButtonInlineTemplate: StoryFn<typeof LinkComponent> = ({
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

const LinkColorsTemplate: StoryFn<typeof LinkComponent> = ({ icon, children = '', ...args }) => {
  return (
    <BaseBox display="flex" flexDirection="column" gap="spacing.2">
      <BaseBox padding="spacing.2">
        <LinkComponent {...args} color="primary">
          {children}
        </LinkComponent>
      </BaseBox>
      <BaseBox padding="spacing.2" backgroundColor="surface.background.cloud.intense">
        <LinkComponent {...args} color="white">
          {children}
        </LinkComponent>
      </BaseBox>
      <BaseBox padding="spacing.2">
        <LinkComponent {...args} color="neutral">
          {children}
        </LinkComponent>
      </BaseBox>
      <BaseBox padding="spacing.2">
        <LinkComponent {...args} color="negative">
          {children}
        </LinkComponent>
      </BaseBox>
      <BaseBox padding="spacing.2">
        <LinkComponent {...args} color="positive">
          {children}
        </LinkComponent>
      </BaseBox>
    </BaseBox>
  );
};

export const LinkWithColor = LinkColorsTemplate.bind({});
LinkWithColor.storyName = 'Link - With Color';
LinkWithColor.args = {
  variant: 'anchor',
  children: 'Learn More',
  href: 'https://github.com/razorpay/blade',
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

export const LinkSizes: StoryFn<typeof LinkComponent> = () => {
  const href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const onClick = (): void => console.log('Never gonna give you up');

  return (
    <BaseBox display="flex" flexDirection="row">
      <BaseBox display="flex" flexDirection="column" marginRight="spacing.5">
        <BaseBox marginBottom="spacing.3">
          <Heading>Anchor variant</Heading>
        </BaseBox>

        <LinkComponent
          variant="anchor"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          size="xsmall"
          icon={DownloadIcon}
        >
          XSmall anchor link
        </LinkComponent>
        <LinkComponent
          variant="anchor"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          icon={DownloadIcon}
        >
          Small anchor link
        </LinkComponent>
        <LinkComponent
          variant="anchor"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          size="medium"
          icon={DownloadIcon}
        >
          Medium anchor link
        </LinkComponent>
        <LinkComponent
          variant="anchor"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          size="large"
          icon={DownloadIcon}
        >
          Large anchor link
        </LinkComponent>
      </BaseBox>
      <BaseBox display="flex" flexDirection="column">
        <BaseBox marginBottom="spacing.3">
          <Heading>Button variant</Heading>
        </BaseBox>
        <LinkComponent size="xsmall" variant="button" onClick={onClick} icon={DownloadIcon}>
          XSmall link button
        </LinkComponent>
        <LinkComponent size="small" variant="button" onClick={onClick} icon={DownloadIcon}>
          Small link button
        </LinkComponent>
        <LinkComponent size="medium" variant="button" onClick={onClick} icon={DownloadIcon}>
          Medium link button
        </LinkComponent>
        <LinkComponent size="large" variant="button" onClick={onClick} icon={DownloadIcon}>
          Large link button
        </LinkComponent>
      </BaseBox>
    </BaseBox>
  );
};
LinkSizes.parameters = {
  docs: {
    description: {
      story:
        '`size` prop can be used to render a `small` or `medium` (default) sized Link component',
    },
  },
};

const LinkWithVariantTemplate: StoryFn<typeof LinkComponent> = ({
  children = 'Link',
  icon,
  iconPosition,
}) => {
  return (
    <>
      <BaseBox paddingBottom="spacing.3">
        <BaseText fontWeight="bold">Anchor</BaseText>
      </BaseBox>
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
      <BaseBox paddingTop="spacing.4" paddingBottom="spacing.3">
        <BaseText fontWeight="bold">Button</BaseText>
      </BaseBox>
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
