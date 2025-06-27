import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box } from '../../components/Box';
import TopNavigation from './Components/TopNav';
import SideNavigation from './Components/SideNav';
import { Settings, UserSettings } from './pages';

export interface NavigationContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const App = () => {
  const [currentPath, setCurrentPath] = React.useState('/settings');

  const renderContent = (): React.ReactNode => {
    switch (currentPath) {
      case '/settings':
        return <Settings />;
      case '/settings/user':
        return <UserSettings />;
      default:
        setCurrentPath('/settings');
        return <Settings />;
    }
  };

  // Make this context available to child components
  const navigationContext = {
    currentPath,
    navigate: (path: string) => setCurrentPath(path),
  };

  return (
    <BrowserRouter>
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        overflowX="hidden"
        overflowY="hidden"
      >
        <Box>
          <TopNavigation navigationContext={navigationContext} />
        </Box>
        <Box flex="1" display="flex" position="relative">
          <Box position="fixed" top="56px" left="spacing.0" bottom="spacing.0" zIndex="1">
            <SideNavigation navigationContext={navigationContext} />
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
              {renderContent()}
            </Box>
          </Box>
        </Box>
      </Box>
    </BrowserRouter>
  );
};

export default App;
