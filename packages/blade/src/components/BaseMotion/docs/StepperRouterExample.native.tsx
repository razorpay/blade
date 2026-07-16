import React from 'react';
import type { StepItemProps } from '~components/StepGroup';
import { StepGroup, StepItem, StepItemIndicator } from '~components/StepGroup';
import { Box } from '~components/Box';

type RouteComponentProps = {
  match: {
    params: {
      id: string;
    };
  };
};

/**
 * State-based stand-in for the web `StepperRouterExample`.
 *
 * Native Storybook cannot use `react-router-dom` (Hermes rejects the RegExps
 * that `path-to-regexp` compiles). We keep the same `routeComponent` contract
 * (`match.params.id`) and drive "route" changes with React state so OnRouteChange
 * stories still demo remount / enter transitions for Fade, Move, Slide, Stagger.
 */
const StepperRouterExample = ({
  routeComponent: RouteComponent,
  stepsSampleData,
}: {
  routeComponent: (props: RouteComponentProps) => React.ReactElement;
  stepsSampleData: StepItemProps[];
}): React.ReactElement => {
  const getStepId = (href: string | undefined): string =>
    (href ?? '').replace('/onboarding/', '');

  const [activeId, setActiveId] = React.useState(() => getStepId(stepsSampleData[0]?.href));

  const selectedIndex = stepsSampleData.findIndex(
    (stepInfo) => getStepId(stepInfo.href) === activeId,
  );

  return (
    <Box>
      <Box
        backgroundColor="surface.background.gray.intense"
        padding="spacing.5"
        borderRadius="medium"
        borderWidth="thin"
        borderColor="surface.border.gray.muted"
        marginBottom="spacing.5"
      >
        <StepGroup width="100%">
          {stepsSampleData.map((stepInfo, index) => {
            const stepId = getStepId(stepInfo.href);
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
                onClick={() => setActiveId(stepId)}
                stepProgress={isSelectedItem ? 'start' : isBeforeSelectedItem ? 'full' : 'none'}
                {...stepInfo}
                // State-driven demo — don't open the href via Linking on native.
                href={undefined}
              />
            );
          })}
        </StepGroup>
      </Box>

      <Box paddingX="spacing.3" paddingBottom="spacing.6">
        {/* key remounts the route component so mount motion presets re-run on "route" change */}
        <RouteComponent key={activeId} match={{ params: { id: activeId } }} />
      </Box>
    </Box>
  );
};

export { StepperRouterExample };
