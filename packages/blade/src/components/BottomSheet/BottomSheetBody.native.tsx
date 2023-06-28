/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ComponentIds } from './componentIds';
import { useBottomSheetContext } from './BottomSheetContext';
import type { BottomSheetBodyProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { componentIds } from '~components/ActionList/componentIds';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { size } from '~tokens/global';

const _BottomSheetBody = ({
  children,
  padding = 'spacing.5',
}: BottomSheetBodyProps): React.ReactElement => {
  const {
    footerHeight,
    setContentHeight,
    setHasBodyPadding,
    isHeaderFloating,
  } = useBottomSheetContext();
  const [bottomSheetHasActionList, setBottomSheetHasActionList] = React.useState<
    boolean | undefined
  >(undefined);

  React.useEffect(() => {
    setBottomSheetHasActionList(false);
    React.Children.forEach(children, (child) => {
      if (isValidAllowedChildren(child, componentIds.ActionList)) {
        setBottomSheetHasActionList(true);
      }
    });
  }, [children]);

  React.useEffect(() => {
    if (padding === 'spacing.0') {
      setHasBodyPadding(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [padding]);

  if (bottomSheetHasActionList === undefined) return <></>;
  // If we are rendering ActionList, then we don't wrap the ActionList with extra wrappers
  // This is to ensure that GorhomBottomSheetSectionList work as expected, adding extra wrappers breaks gorhom's rendering
  return (
    <>
      {bottomSheetHasActionList ? (
        children
      ) : (
        <BottomSheetScrollView
          onContentSizeChange={(_width, height) => {
            setContentHeight(height);
          }}
          style={{ marginBottom: footerHeight, borderRadius: isHeaderFloating ? size[16] : 0 }}
        >
          <BaseBox flexShrink={1} flexGrow={1} overflow="hidden">
            <BaseBox
              paddingLeft={bottomSheetHasActionList ? 'spacing.3' : padding}
              paddingRight={bottomSheetHasActionList ? 'spacing.3' : padding}
              paddingTop={bottomSheetHasActionList ? 'spacing.3' : padding}
              paddingBottom={bottomSheetHasActionList ? 'spacing.3' : padding}
              overflow="hidden"
            >
              {children}
            </BaseBox>
          </BaseBox>
        </BottomSheetScrollView>
      )}
    </>
  );
};

const BottomSheetBody = assignWithoutSideEffects(_BottomSheetBody, {
  componentId: ComponentIds.BottomSheetBody,
});

export { BottomSheetBody };
