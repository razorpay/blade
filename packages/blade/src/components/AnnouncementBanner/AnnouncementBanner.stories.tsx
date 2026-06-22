import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { ReactElement } from 'react';
import type { AnnouncementBannerProps } from './AnnouncementBanner';
import { AnnouncementBanner as AnnouncementBannerComponent } from './AnnouncementBanner';
import { AnnouncementIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { Box } from '~components/Box';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="AnnouncementBanner"
      componentDescription="A slim, full-bleed banner used to surface a single short, system-wide promotional or informational message at the top or bottom edge of a page."
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=123476-17024"
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={400}>
        {`
        import { AnnouncementBanner, AnnouncementIcon } from '@razorpay/blade/components';

        function App() {
          // The banner's colour treatment follows the app's colorScheme
          // (set on BladeProvider) — dark app renders the dark banner,
          // light app renders the light banner. No theme prop needed.
          return (
            <AnnouncementBanner icon={AnnouncementIcon} alignment="center">
              Enter promotional text here
            </AnnouncementBanner>
          );
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const meta: Meta<AnnouncementBannerProps> = {
  title: 'Components/AnnouncementBanner',
  component: AnnouncementBannerComponent,
  args: {
    children: 'Enter promotional text here',
    alignment: 'center',
    icon: AnnouncementIcon,
  },
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const AnnouncementBannerTemplate: StoryFn<typeof AnnouncementBannerComponent> = ({ ...args }) => {
  return <AnnouncementBannerComponent {...args} />;
};

export const Default = AnnouncementBannerTemplate.bind({});
Default.parameters = {
  docs: {
    description: {
      story:
        'In a light-themed app the banner renders a subtle gray background with dark text. The treatment is driven by the app `colorScheme`, not a prop.',
    },
  },
};

export const DarkColorScheme: StoryFn<typeof AnnouncementBannerComponent> = ({ ...args }) => {
  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
      <Box backgroundColor="surface.background.gray.subtle" padding="spacing.6">
        <AnnouncementBannerComponent {...args} />
      </Box>
    </BladeProvider>
  );
};
DarkColorScheme.parameters = {
  docs: {
    description: {
      story:
        'When the app `colorScheme` is `dark` (set on `BladeProvider`), the banner automatically renders the dark treatment — a translucent dark background with light text. No prop is required.',
    },
  },
};

export const LeftAligned = AnnouncementBannerTemplate.bind({});
LeftAligned.args = {
  alignment: 'left',
  children: 'Switch to the new dashboard experience today.',
};
LeftAligned.parameters = {
  docs: {
    description: {
      story: 'Content can be left aligned instead of the default center alignment.',
    },
  },
};

export const WithoutIcon = AnnouncementBannerTemplate.bind({});
WithoutIcon.args = {
  icon: undefined,
};
WithoutIcon.parameters = {
  docs: {
    description: {
      story: 'Omit the `icon` prop to render the banner without a leading icon.',
    },
  },
};

export const WithInlineLink: StoryFn<typeof AnnouncementBannerComponent> = ({ ...args }) => {
  return (
    <AnnouncementBannerComponent {...args}>
      Your KYC is verified.&nbsp;
      <Link href="https://razorpay.com" target="_blank" variant="anchor" size="small">
        View details
      </Link>
    </AnnouncementBannerComponent>
  );
};
WithInlineLink.parameters = {
  docs: {
    description: {
      story: 'The message can contain an inline `Link` for in-context navigation.',
    },
  },
};

export default meta;
