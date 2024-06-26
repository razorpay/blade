import { TabNav, TabNavItem } from '../TabNav';
import { TopNav, TopNavActions, TopNavBrand, TopNavContent } from '../TopNav';
import { Avatar } from '~components/Avatar';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { ActivityIcon, AnnouncementIcon, HomeIcon } from '~components/Icons';
import { RazorpayLogo } from '~components/SideNav/docs/RazorpayLogo';
import { Tooltip } from '~components/Tooltip';

const TopNavExample = (): React.ReactElement => {
  return (
    <Box height="100vh" backgroundColor="surface.background.gray.intense">
      <TopNav>
        <TopNavBrand>
          <RazorpayLogo />
        </TopNavBrand>
        <TopNavContent>
          <TabNav>
            <TabNavItem icon={HomeIcon} accessibilityLabel="Home" href="/home" />
            <TabNavItem href="/payroll">Payroll</TabNavItem>
            <TabNavItem href="/payments">Payments</TabNavItem>
            <TabNavItem href="/magic-checkout">Magic Checkout</TabNavItem>
          </TabNav>
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
