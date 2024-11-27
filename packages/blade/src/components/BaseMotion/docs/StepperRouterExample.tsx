import { Route, useHistory, useLocation, matchPath, Switch } from 'react-router-dom';
import type { StepItemProps } from '~components/StepGroup';
import { StepGroup, StepItem, StepItemIndicator } from '~components/StepGroup';
import { AnimatePresence } from 'motion/react';
import { Box } from '~components/Box';
import React from 'react';

const stepsSampleData: StepItemProps[] = [
  {
    title: 'Introduction',
    timestamp: 'Mon, 15th Oct’23 | 12:00pm',
    description: 'Introduction to Razorpay Payment Gateway',
  },
  {
    title: 'Personal Details',
    timestamp: 'Mon, 16th Oct’23 | 12:00pm',
    description: 'Fill your Personal Details for onboarding',
  },
  {
    title: 'Business Details',
    timestamp: 'Mon, 17th Oct’23 | 12:00pm',
    description: 'Fill your Business Details for onboarding',
    isDisabled: true,
  },
  {
    title: 'Complete Onboarding',
    timestamp: 'Mon, 20th Oct’23 | 12:00pm',
    description: 'Complete your onboarding to start',
  },
];

const StepperRouterExample = ({
  routeComponent,
}: {
  routeComponent: (_props: any) => React.ReactElement;
}): React.ReactElement => {
  const history = useHistory();
  const navigateTo = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    history.push(url);
  };

  const location = useLocation();

  const getPathnameFromTitle = (title: string): string => {
    return `/onboarding/${title.toLowerCase().replace(/ /g, '-')}`;
  };

  const getSelectedItemIndex = (pathname: string) => {
    return stepsSampleData.findIndex((stepInfo) =>
      matchPath(pathname, getPathnameFromTitle(stepInfo.title)),
    );
  };

  return (
    <Box display="flex" flexDirection="row" minHeight="500px">
      <Box
        backgroundColor="surface.background.gray.intense"
        padding="spacing.7"
        position="fixed"
        left="spacing.0"
        top="spacing.0"
        height="100%"
        minWidth="400px"
        elevation="midRaised"
      >
        <StepGroup width="100%">
          {stepsSampleData.map((stepInfo, index) => {
            const stepPathname = getPathnameFromTitle(stepInfo.title);
            const selectedIndex = getSelectedItemIndex(location.pathname);

            const isBeforeSelectedItem = index < selectedIndex;
            const isSelectedItem = index === selectedIndex;

            return (
              <StepItem
                key={`${stepInfo.title}-${index}`}
                isSelected={isSelectedItem}
                marker={
                  <StepItemIndicator
                    color={
                      isSelectedItem ? 'primary' : isBeforeSelectedItem ? 'positive' : 'neutral'
                    }
                  />
                }
                onClick={(e) => navigateTo(e, stepPathname)}
                stepProgress={isSelectedItem ? 'start' : isBeforeSelectedItem ? 'full' : 'none'}
                {...stepInfo}
              />
            );
          })}
        </StepGroup>
      </Box>

      <Box marginLeft="400px" paddingX="spacing.6" paddingBottom="spacing.6">
        <AnimatePresence mode="wait">
          <Switch location={location} key={location.pathname}>
            <Route path="/onboarding/:id" component={routeComponent} />
          </Switch>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export { StepperRouterExample };
