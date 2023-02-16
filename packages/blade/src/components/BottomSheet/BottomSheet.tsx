/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
import styled from 'styled-components';
import { BottomSheetGrabHandle, BottomSheetHeader } from './BottomSheetHeader';
import { ComponentIds } from './componentIds';
import BaseBox from '~components/Box/BaseBox';
import type { WithComponentId } from '~utils';
import { makeSpace } from '~utils';

type BottomSheetProps = {
  children: React.ReactNode;
};

const BottomSheetSurface = styled.div(({ theme }) => {
  const offsetX = theme.shadows.offsetX.level[1];
  const offsetY = theme.shadows.offsetY.level[1];
  const blur = theme.shadows.blurRadius.level[1];
  const shadowColor = theme.shadows.color.level[1];

  const shadow1 = `${offsetX}px ${offsetY}px ${blur}px 0px ${shadowColor}`;
  const shadow2 = `0px 0px 1px 0px ${shadowColor}`;

  return {
    background: theme.colors.surface.background.level2.lowContrast,
    // TODO: we do not have 16px radius token
    borderTopLeftRadius: makeSpace(theme.spacing[5]),
    borderTopRightRadius: makeSpace(theme.spacing[5]),
    borderColor: theme.colors.surface.border.normal.lowContrast,
    boxShadow: `${shadow1}, ${shadow2}`,
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    // paddingTop: makeSpace(theme.spacing[5]),
    // TODO: fix
    top: window.innerHeight / 2,
    height: window.innerHeight,
    backgroundColor: 'white',
    touchAction: 'none',
    overflow: 'hidden',
  };
});

const BottomSheetBody: WithComponentId<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BaseBox
      marginLeft="spacing.3"
      marginRight="spacing.3"
      marginTop="spacing.3"
      marginBottom="spacing.3"
    >
      {children}
    </BaseBox>
  );
};
BottomSheetBody.componentId = ComponentIds.BottomSheetBody;

const BottomSheet = ({ children }: BottomSheetProps): React.ReactElement => {
  return (
    <BottomSheetSurface>
      <BottomSheetGrabHandle />
      {children}
    </BottomSheetSurface>
  );
};

export { BottomSheet, BottomSheetBody, BottomSheetHeader, BottomSheetProps };
