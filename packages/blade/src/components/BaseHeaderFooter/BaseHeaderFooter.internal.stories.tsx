import { BaseHeader } from './BaseHeader';
import { BaseFooter } from './BaseFooter';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';
import { AnnouncementIcon, DownloadIcon, StarIcon } from '~components/Icons';
import type { BoxProps } from '~components/Box';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Checkbox } from '~components/Checkbox';
import { isReactNative } from '~utils';
import { Link } from '~components/Link';

const HeaderContainer = ({ children }: { children: BoxProps['children'] }): React.ReactElement => {
  return <Box padding={{ base: 'spacing.0', m: 'spacing.2' }}>{children}</Box>;
};

export const BaseHeaderKitchenSink = (): React.ReactElement => {
  return (
    <Box backgroundColor="surface.background.gray.intense" maxWidth={{ base: '100%', m: '500px' }}>
      <HeaderContainer>
        <BaseHeader
          title="Simple BaseHeader"
          subtitle="Subtitle"
          showCloseButton={false}
          showBackButton={false}
        />
      </HeaderContainer>
      <HeaderContainer>
        <BaseHeader
          leading={<StarIcon color="surface.icon.gray.normal" size="large" />}
          title="When The Title small"
          subtitle="Header Subtitle"
          titleSuffix={<Badge color="positive">New</Badge>}
          trailing={<Amount value={1000} />}
          showCloseButton={false}
          showBackButton={false}
        />
      </HeaderContainer>
      <HeaderContainer>
        <BaseHeader
          title="With Close and Back Button"
          subtitle="Header Subtitle"
          trailing={<Amount value={1000} />}
          showCloseButton={true}
          showBackButton={true}
        />
      </HeaderContainer>
      <HeaderContainer>
        <BaseHeader
          leading={<StarIcon color="surface.icon.gray.normal" size="large" />}
          title="When The Title is So Large That It Goes On Next Line"
          subtitle="When The Subtitle of this BaseHeader is So Largeeeee That It Goes On Next Line"
          titleSuffix={<Badge color="positive">New</Badge>}
          trailing={<Link>Apply</Link>}
          showCloseButton={true}
          showBackButton={true}
        />
      </HeaderContainer>
      <HeaderContainer>
        <BaseHeader
          leading={<StarIcon color="surface.icon.gray.normal" size="large" />}
          title="When_Title_Does_Not_Break_Word_And_Goes_On_Next_Line"
          subtitle="When The Subtitle of this BaseHeader is So Largeeeee That It Goes On Next Line"
          titleSuffix={<Badge color="positive">New</Badge>}
          trailing={<Link>Apply</Link>}
          showCloseButton={true}
          showBackButton={true}
        />
      </HeaderContainer>
      <HeaderContainer>
        <BaseHeader
          leading={
            isReactNative() ? undefined : (
              <img
                src="https://flagcdn.com/w20/in.png"
                srcSet="https://flagcdn.com/w40/in.png 2x"
                width="20"
                alt="India"
              />
            )
          }
          title="When The Title is So Large That It Goes On Next Line"
          subtitle="When The Subtitle of this BaseHeader is So Largeeeee That It Goes On Next Line"
          titleSuffix={<Badge color="positive">New</Badge>}
          trailing={<Amount value={1000} />}
          showCloseButton={true}
          showBackButton={true}
        />
      </HeaderContainer>
      <HeaderContainer>
        <BaseHeader
          leading={<AnnouncementIcon color="surface.icon.gray.normal" size="large" />}
          title="Announcements"
          subtitle="This is an announcement"
          titleSuffix={
            <Badge size="small" color="positive">
              New
            </Badge>
          }
          trailing={<Button icon={DownloadIcon} />}
        />
      </HeaderContainer>
      <HeaderContainer>
        <BaseHeader
          leading={<AnnouncementIcon color="surface.icon.gray.normal" size="medium" />}
          title="Announcements"
          subtitle="This is an announcement"
          size="medium"
          titleSuffix={
            <Badge size="small" color="positive">
              New
            </Badge>
          }
          trailing={<Button icon={DownloadIcon} />}
        />
      </HeaderContainer>
      <HeaderContainer>
        <BaseHeader
          leading={<StarIcon color="surface.icon.gray.normal" size="medium" />}
          title="When The Title is So Large That It Goes On Next Line"
          subtitle="When The Subtitle of this BaseHeader is So Largeeeee That It Goes On Next Line"
          titleSuffix={
            <Badge size="small" color="positive">
              New
            </Badge>
          }
          trailing={<Link>Apply</Link>}
          showCloseButton={true}
          showBackButton={false}
          size="medium"
        />
      </HeaderContainer>
    </Box>
  );
};

export const BaseFooterSink = (): React.ReactElement => {
  return (
    <Box backgroundColor="surface.background.gray.intense" maxWidth={{ base: '100%', m: '500px' }}>
      <BaseFooter>
        <Button isFullWidth>Submit</Button>
      </BaseFooter>
      <BaseFooter>
        <Box display="flex" alignItems="center">
          <Box flex="1">
            <Checkbox>I agree terms and conditions</Checkbox>
          </Box>
          <Box display="flex">
            <Button variant="secondary">Sign Up</Button>
            <Button marginLeft="spacing.4">Sign In</Button>
          </Box>
        </Box>
      </BaseFooter>
    </Box>
  );
};

const BaseHeaderFooterMeta = {
  title: 'Components/BaseHeaderFooter',
  component: BaseHeader,
  args: {},
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
};

export default BaseHeaderFooterMeta;
