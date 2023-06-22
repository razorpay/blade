/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ComponentIds } from './componentIds';
import { useBottomSheetContext } from './BottomSheetContext';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';
import type { SpacingValueType } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { isValidAllowedChildren, metaAttribute } from '~utils';
import { componentIds } from '~components/ActionList/componentIds';

const bodyStyles: React.CSSProperties = {
  WebkitTapHighlightColor: 'revert',
  WebkitTouchCallout: 'revert',
  WebkitUserSelect: 'auto',
  overscrollBehavior: 'contain',
  WebkitOverflowScrolling: 'touch',
  userSelect: 'auto',
  overflow: 'auto',
  touchAction: 'none',
};

type BottomSheetBodyProps = {
  children: React.ReactNode;
  /**
   * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
   * @default `spacing.5`
   *
   * **Links:**
   * - Docs: https://blade.razorpay.com/?path=/docs/tokens-spacing--page
   */
  padding?: Extract<SpacingValueType, 'spacing.0' | 'spacing.5'>;
};

const _BottomSheetBody = ({
  children,
  padding = 'spacing.5',
}: BottomSheetBodyProps): React.ReactElement => {
  const { scrollRef, setContentHeight, setHasBodyPadding, isOpen, bind } = useBottomSheetContext();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [bottomSheetHasActionList, setBottomSheetHasActionList] = React.useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    if (!contentRef.current) return;
    setContentHeight(contentRef.current.getBoundingClientRect().height);
  }, [contentRef, isOpen, children]);

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

  return (
    <BaseBox
      {...metaAttribute({
        testID: 'bottomsheet-body',
        name: ComponentIds.BottomSheetBody,
      })}
      ref={scrollRef}
      flexGrow={1}
      flexShrink={1}
      style={bodyStyles}
      // Passing isContentDragging to bind()
      // Inside the useDrag() hook this will let us know if user is dragging the content or not
      {...bind?.({ isContentDragging: true })}
    >
      <BaseBox
        paddingLeft={bottomSheetHasActionList ? 'spacing.3' : padding}
        paddingRight={bottomSheetHasActionList ? 'spacing.3' : padding}
        paddingTop={bottomSheetHasActionList ? 'spacing.3' : padding}
        paddingBottom={bottomSheetHasActionList ? 'spacing.3' : padding}
        ref={contentRef}
        overflow="auto"
      >
        {children}
      </BaseBox>
    </BaseBox>
  );
};

const BottomSheetBody = assignWithoutSideEffects(_BottomSheetBody, {
  componentId: ComponentIds.BottomSheetBody,
});

export { BottomSheetBody };
