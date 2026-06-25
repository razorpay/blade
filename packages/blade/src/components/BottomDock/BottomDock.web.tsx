import React from 'react';
import styled from 'styled-components';
import type { BottomDockProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { colors as globalColors } from '~tokens/global';
import { componentZIndices } from '~utils/componentZIndices';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { useTheme } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const BOTTOM_DOCK_SHADOW_Y_OFFSET = -8;
const BOTTOM_DOCK_SHADOW_BLUR_RADIUS = 24;
const BOTTOM_DOCK_SAFE_AREA_FALLBACK = '23px';

const StyledBottomDock = styled(BaseBox)<{ $boxShadowColor: string }>(({ $boxShadowColor }) => {
  return {
    // Figma _components/Bottom Nav: 0px -8px 24px 0px _styles.bottomNav.color.
    boxShadow: `0px ${BOTTOM_DOCK_SHADOW_Y_OFFSET}px ${BOTTOM_DOCK_SHADOW_BLUR_RADIUS}px 0px ${$boxShadowColor}`,
    // Figma's Dragger is device chrome; reserve its layout space without rendering the pill.
    paddingBottom: `max(env(safe-area-inset-bottom), ${BOTTOM_DOCK_SAFE_AREA_FALLBACK})`,
  };
});

const _BottomDock = (
  {
    children,
    zIndex = componentZIndices.bottomNav,
    role,
    accessibilityLabel,
    testID,
    metaName,
    display,
    flexDirection,
    gap,
    paddingTop,
    paddingX,
    paddingBottom,
    alignItems,
    justifyContent,
    nativeStyle: _nativeStyle,
    ...rest
  }: BottomDockProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { colorScheme } = useTheme();
  const boxShadowColor =
    colorScheme === 'light'
      ? globalColors.neutral.blueGrayLight.a912
      : globalColors.neutral.black[100];

  return (
    <StyledBottomDock
      ref={ref as never}
      $boxShadowColor={boxShadowColor}
      {...makeAccessible({ role, label: accessibilityLabel })}
      position="fixed"
      bottom="spacing.0"
      left="spacing.0"
      width="100%"
      backgroundColor="surface.background.gray.intense"
      borderTopWidth="thin"
      borderTopColor="surface.border.gray.muted"
      display={display}
      flexDirection={flexDirection}
      gap={gap}
      paddingTop={paddingTop}
      paddingX={paddingX}
      paddingBottom={paddingBottom}
      alignItems={alignItems}
      justifyContent={justifyContent}
      {...getStyledProps(rest)}
      zIndex={zIndex}
      {...metaAttribute({
        testID,
        name: metaName,
      })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </StyledBottomDock>
  );
};

const BottomDock = assignWithoutSideEffects(React.forwardRef(_BottomDock), {
  displayName: 'BottomDock',
});

export { BottomDock };
