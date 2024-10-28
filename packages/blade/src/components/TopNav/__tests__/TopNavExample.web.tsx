import { TopNav, TopNavActions, TopNavBrand, TopNavContent } from '../TopNav';
import { Avatar } from '~components/Avatar';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { ActivityIcon, AnnouncementIcon } from '~components/Icons';
import { RazorpayLogo } from '~components/SideNav/docs/RazorpayLogo';
import { Tooltip } from '~components/Tooltip';

const TopNavExample = (): React.ReactElement => {
  return (
    <Box height="100vh" backgroundColor="surface.background.gray.intense">
      <TopNav backgroundColor="surface.background.gray.intense">
        <TopNavBrand>
          <RazorpayLogo />
        </TopNavBrand>
        <TopNavContent>
          <p>hi</p>
        </TopNavContent>
        <TopNavActions>
          <Tooltip content="View Ecosystem Health">
            <Button
              size="medium"
              variant="tertiary"
              icon={ActivityIcon}
              accessibilityLabel="View Ecosystem Health"
            />
          </Tooltip>
          <Tooltip content="View Announcements">
            <Button
              variant="tertiary"
              icon={AnnouncementIcon}
              accessibilityLabel="View Announcements"
            />
          </Tooltip>
          <Avatar size="medium" name="Anurag Hazra" />
        </TopNavActions>
      </TopNav>
    </Box>
  );
};

export { TopNavExample };
