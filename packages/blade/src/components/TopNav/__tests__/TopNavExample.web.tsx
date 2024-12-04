import { TabNav, TabNavItem, TabNavItems } from '../TabNav';
import { TopNav, TopNavActions, TopNavBrand, TopNavContent } from '../TopNav';
import { Avatar } from '~components/Avatar';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { ActivityIcon, AnnouncementIcon, ChevronDownIcon } from '~components/Icons';
import { RazorpayLogo } from '~components/SideNav/docs/RazorpayLogo';
import { Tooltip } from '~components/Tooltip';
import { Menu, MenuItem, MenuOverlay } from '~components/Menu';
import { Text } from '~components/Typography';

const TopNavExample = (): React.ReactElement => {
  return (
    <Box height="100vh" backgroundColor="surface.background.gray.intense">
      <TopNav
        backgroundColor="surface.background.gray.intense"
        data-analytics-topnav="demo"
        testID="demo"
      >
        <TopNavBrand>
          <RazorpayLogo />
        </TopNavBrand>
        <TopNavContent>
          <TabNav
            items={[
              { title: 'Home', href: '/home' },
              {
                href: '/payroll',
                title: 'Payroll',
              },
              {
                href: '/payments',
                title: 'Payments',
              },
              {
                href: '/magic-checkout',
                title: 'Magic Checkout',
              },
              {
                href: '/rize',
                title: 'Rize',
                isAlwaysOverflowing: true,
              },
            ]}
          >
            {({ items, overflowingItems }) => {
              return (
                <>
                  <TabNavItems>
                    {items.map((item) => {
                      return (
                        <TabNavItem
                          key={item.title}
                          title={item.title}
                          href={item.href}
                          icon={item.icon}
                          isActive={item.isActive}
                          trailing={item.trailing}
                          data-analytics-tabnavitem={item.title}
                        />
                      );
                    })}
                  </TabNavItems>
                  {overflowingItems.length ? (
                    <Menu openInteraction="hover">
                      <TabNavItem href="#" title="More" trailing={<ChevronDownIcon />} />
                      <MenuOverlay>
                        {overflowingItems.map((item) => {
                          return (
                            <MenuItem
                              key={item.href}
                              onClick={() => {
                                console.log('clicked', item.title);
                              }}
                            >
                              <Text>{item.title}</Text>
                            </MenuItem>
                          );
                        })}
                      </MenuOverlay>
                    </Menu>
                  ) : null}
                </>
              );
            }}
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
