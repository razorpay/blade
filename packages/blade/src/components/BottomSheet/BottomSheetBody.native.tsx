/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { ComponentIds } from './componentIds';
import { useBottomSheetContext } from './BottomSheetContext';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { isValidAllowedChildren } from '~utils';
import { componentIds } from '~components/ActionList/componentIds';

const _BottomSheetBody = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { footerHeight, onBodyScroll } = useBottomSheetContext();
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

  if (bottomSheetHasActionList === undefined) return <></>;
  // If we are rendering ActionList, then we don't wrap the ActionList with extra wrappers
  // This is to ensure that GorhomBottomSheetSectionList work as expected, adding extra wrappers breaks gorhom's rendering
  return (
    <>
      {bottomSheetHasActionList ? (
        children
      ) : (
        <BottomSheetScrollView
          onScroll={({ nativeEvent }) => {
            onBodyScroll(nativeEvent);
          }}
          style={{ marginBottom: footerHeight }}
        >
          <BaseBox flexShrink={1} flexGrow={1} overflow="hidden">
            <BaseBox
              marginLeft="spacing.5"
              marginRight="spacing.5"
              paddingTop="spacing.5"
              paddingBottom="spacing.5"
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
