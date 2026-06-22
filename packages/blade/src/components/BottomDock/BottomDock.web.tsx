import React from 'react';
import styled from 'styled-components';
import type { BottomDockProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { colors as globalColors } from '~tokens/global';
import { componentZIndices } from '~utils/componentZIndices';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { useTheme } from '~utils';

const StyledBottomDock = styled(BaseBox)<{ $boxShadowColor: string }>(({ $boxShadowColor }) => {
  return {
    boxShadow: `0px -8px 24px 0px ${$boxShadowColor}`,
    // Figma's Dragger is device chrome; reserve its layout space without rendering the pill.
    paddingBottom: 'max(env(safe-area-inset-bottom), 23px)',
  };
});

const _BottomDock = (
  {
    children,
    zIndex = componentZIndices.bottomNav,
    role,
    testID,
    metaName,
    dockLayoutProps,
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
      role={role}
      position="fixed"
      bottom="spacing.0"
      left="spacing.0"
      width="100%"
      backgroundColor="surface.background.gray.intense"
      borderTopWidth="thin"
      borderTopColor="surface.border.gray.muted"
      {...dockLayoutProps}
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

const BottomDock = React.forwardRef(_BottomDock);

export { BottomDock };
