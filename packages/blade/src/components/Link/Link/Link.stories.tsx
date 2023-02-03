import type { ComponentStory, Meta } from '@storybook/react';
import { Title, Description } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import type { LinkProps } from './Link';
import LinkComponent from './Link';
import iconMap from '~components/Icons/iconMap';
import { DownloadIcon, InfoIcon } from '~components/Icons';
import { BaseText } from '~components/Typography/BaseText';
import Box from '~components/Box/BaseBox';
import { Heading, Text } from '~components/Typography';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="This is the Link component which can be used for showing external or internal Links to the user. The Link component can also be used as an inline button in certain cases with the `button` variant"
      componentName="Link"
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=12699%3A147155',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=10564%3A195587',
      }}
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Link } from '@razorpay/blade/components';

          function App(): JSX.Element {
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
  argTypes: {
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
} as Meta<LinkProps>;

const LinkTemplate: ComponentStory<typeof LinkComponent> = ({
  children = 'Learn More',
  ...args
}) => {
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

export const LinkSizes: ComponentStory<typeof LinkComponent> = () => {
  const href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const onClick = (): void => console.log('Never gonna give you up');

  return (
    <Box display="flex" flexDirection="row">
      <Box display="flex" flexDirection="column" marginRight="spacing.5">
        <Box marginBottom="spacing.3">
          <Heading>Anchor variant</Heading>
        </Box>
        <Box marginBottom="spacing.2">
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
        </Box>
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
      </Box>
      <Box display="flex" flexDirection="column">
        <Box marginBottom="spacing.3">
          <Heading>Button variant</Heading>
        </Box>
        <Box marginBottom="spacing.2">
          <LinkComponent size="small" variant="button" onClick={onClick} icon={DownloadIcon}>
            Small link button
          </LinkComponent>
        </Box>
        <LinkComponent size="medium" variant="button" onClick={onClick} icon={DownloadIcon}>
          Medium link button
        </LinkComponent>
      </Box>
    </Box>
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
