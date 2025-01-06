import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Route, useHistory, useLocation, matchPath, Switch } from 'react-router-dom';
import type { StepItemProps } from '~components/StepGroup';
import { StepGroup, StepItem, StepItemIndicator } from '~components/StepGroup';
import { Box } from '~components/Box';

const StepperRouterExample = ({
  routeComponent,
  stepsSampleData,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routeComponent: (_props: any) => React.ReactElement;
  stepsSampleData: StepItemProps[];
}): React.ReactElement => {
  const history = useHistory();
  const navigateTo = (e: React.MouseEvent, url: string): void => {
    e.preventDefault();
    history.push(url);
  };

  const location = useLocation();

  const getSelectedItemIndex = (pathname: string): number => {
    return stepsSampleData.findIndex((stepInfo) => matchPath(pathname, stepInfo.href!));
  };

  return (
    <Box minHeight="500px">
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
            const stepPathname = stepInfo.href!.replace('/onboarding/', '');
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
