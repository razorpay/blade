import React from 'react';
import type { BottomBarProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { BottomDock } from '~components/BottomDock';
import { componentZIndices } from '~utils/componentZIndices';
import { MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

/**
 * ### BottomBar component
 *
 * BottomBar is a fixed bottom action surface for mobile layouts.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
 * <BottomBar>
 *   <Button isFullWidth>Cancel</Button>
 *   <Button isFullWidth>Continue</Button>
 * </BottomBar>
 * ```
 */
const _BottomBar = (
  {
    children,
    zIndex = componentZIndices.bottomNav,
    testID,
    accessibilityLabel,
    ...rest
  }: BottomBarProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  return (
    <BottomDock
      ref={ref as never}
      role="group"
      accessibilityLabel={accessibilityLabel}
      safeAreaBottom
      display="flex"
      flexDirection="column"
      gap="spacing.3"
      paddingTop="spacing.2"
      paddingX="spacing.2"
      zIndex={zIndex}
      testID={testID}
      metaName={MetaConstants.BottomBar}
      {...rest}
    >
      <BaseBox
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="spacing.2"
        paddingX="spacing.4"
        paddingY="spacing.3"
      >
        {children}
      </BaseBox>
    </BottomDock>
  );
};

const BottomBar = assignWithoutSideEffects(React.forwardRef(_BottomBar), {
  displayName: 'BottomBar',
  componentId: 'BottomBar',
});

export { BottomBar };
