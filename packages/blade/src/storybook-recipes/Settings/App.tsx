import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Box } from '../../components/Box';
import TopNavigation from './Components/TopNav';
import SideNavigation from './Components/SideNav';
import { Settings } from './SettingsPage';
import { UserSettings } from './UserSettingPage';

const App = (): React.ReactElement => {
  return (
    <BrowserRouter>
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        overflowX="hidden"
        overflowY="hidden"
        margin="-2em"
      >
        <Box>
          <TopNavigation />
        </Box>
        <Box flex="1" display="flex" position="relative">
          <Box position="fixed" top="56px" left="spacing.0" bottom="spacing.0" zIndex="1">
            <SideNavigation />
          </Box>
          <Box
            marginLeft={{ base: 'spacing.0', m: '240px', xl: '264px' }}
            width="100%"
            maxWidth="100vw"
            overflowX="hidden"
          >
            <Box
              height="calc(100vh - 56px)"
              overflowY="auto"
              overflowX="hidden"
              backgroundColor="surface.background.gray.moderate"
            >
              <Switch>
                <Route path="/user-settings" component={UserSettings} />
                <Route path="/" component={Settings} />
              </Switch>
            </Box>
          </Box>
        </Box>
      </Box>
    </BrowserRouter>
  );
};

export default App;
