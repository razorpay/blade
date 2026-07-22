import React from 'react';
import { View } from 'react-native';
import type { BottomBarProps } from './types';
import { BottomDock } from '~components/BottomDock';
import { useTheme } from '~components/BladeProvider';
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
  const { theme } = useTheme();

  return (
    <BottomDock
      ref={ref as never}
      role="region"
      accessibilityLabel={accessibilityLabel}
      safeAreaBottom
      zIndex={zIndex}
      testID={testID}
      metaName={MetaConstants.BottomBar}
      nativeStyle={{
        paddingTop: theme.spacing[2],
        paddingHorizontal: theme.spacing[2],
      }}
      {...rest}
    >
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: theme.spacing[2],
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3],
        }}
      >
        {children}
      </View>
    </BottomDock>
  );
};

const BottomBar = assignWithoutSideEffects(React.forwardRef(_BottomBar), {
  displayName: 'BottomBar',
  componentId: 'BottomBar',
});

export { BottomBar };
