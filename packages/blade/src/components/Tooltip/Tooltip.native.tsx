/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { arrow, shift, useFloating, flip, offset } from '@floating-ui/react-native';
import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Portal } from '@gorhom/portal';
import { TooltipContent } from './TooltipContent';
import type { TooltipProps } from './types';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { TooltipContext } from './TooltipContext';
import { componentIds } from './componentIds';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getFloatingPlacementParts } from '~utils/getFloatingPlacementParts';
import { mergeProps } from '~utils/mergeProps';
import { componentZIndices } from '~utils/componentZIndices';
import { useTheme } from '~components/BladeProvider';
import { PopupArrow } from '~components/PopupArrow';
import { useFloatingPortal } from '~components/Popover/useFloatingPortal.native';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

// Portal container rendered by @gorhom/portal has a 10px top offset on iOS relative
// to the window coordinate system that measureInWindow doesn't account for.
const IOS_OFFSET_CORRECTION = 10;

const _Tooltip = ({
  title,
  content,
  children,
  placement = 'left',
  onOpenChange,
  zIndex = componentZIndices.tooltip,
  maxWidth,
}: TooltipProps): React.ReactElement => {
  const { theme, colorScheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const gap = theme.spacing[2];
  const [side] = getFloatingPlacementParts(placement);
  const isHorizontal = side === 'left' || side === 'right';
  const arrowRef = React.useRef();

  const context = useFloating({
    sameScrollView: false,
    placement,
    middleware: [
      shift({ crossAxis: false, padding: gap }),
      flip({ padding: gap }),
      offset(gap + ARROW_HEIGHT),
      arrow({
        element: arrowRef,
        padding: isHorizontal ? 0 : ARROW_WIDTH,
      }),
    ],
  });

  const { refs, floatingStyles, update } = context;

  const [isVisible, setIsVisible] = React.useState(() => isOpen);
  const { backdropRef, backdropOffset, onBackdropLayout } = useFloatingPortal(update, isVisible);

  const handleOpen = React.useCallback(() => {
    if (isOpen) return;
    setIsOpen(true);
    onOpenChange?.({ isOpen: true });
  }, [isOpen, onOpenChange]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    onOpenChange?.({ isOpen: false });
  }, [onOpenChange]);

  // wait for animation to finish before unmounting
  React.useEffect(() => {
    const id = setTimeout(() => {
      if (!isOpen) {
        setIsVisible(false);
      }
    }, theme.motion.duration.gentle);

    if (isOpen) {
      setIsVisible(true);
    }
    return () => clearTimeout(id);
  }, [isOpen]);

  return (
    <TooltipContext.Provider value={true}>
      {/* Cloning the trigger children to enhance it with ref and event handler.
          Button uses Pressable `onPress` (via `onClick`); `onTouchEnd` alone is
          unreliable inside ScrollView / ButtonGroup — real taps often only fire
          press. Attach both so Storybook and product taps open the tooltip. */}
      {React.cloneElement(children, {
        ...mergeProps(
          {
            onTouchEnd: children.props.onTouchEnd,
            onClick: children.props.onClick,
          },
          {
            onTouchEnd: handleOpen,
            onClick: handleOpen,
          },
        ),
        ref: refs.setReference,
      })}
      {isVisible && (
        <Portal hostName="BladeBottomSheetPortal">
          <TouchableOpacity
            ref={backdropRef}
            onLayout={onBackdropLayout}
            style={StyleSheet.absoluteFill}
            onPress={handleClose}
            activeOpacity={1}
            testID="tooltip-modal-backdrop"
            {...metaAttribute({ name: MetaConstants.Tooltip })}
          >
            <TooltipContent
              title={title}
              isVisible={isOpen}
              ref={refs.setFloating}
              side={side}
              colorScheme={colorScheme}
              maxWidth={maxWidth}
              style={{
                ...floatingStyles,
                // if the position is zero move the floating element outside of the viewport
                // this happens because measure is async and it takes a few milliseconds to calculate positions
                left: (floatingStyles.left || -200) - backdropOffset.x,
                top:
                  (floatingStyles.top || -200) -
                  backdropOffset.y -
                  (Platform.OS === 'ios' ? IOS_OFFSET_CORRECTION : 0),
                zIndex,
              }}
              arrow={
                <PopupArrow
                  ref={arrowRef as never}
                  context={context}
                  width={ARROW_WIDTH}
                  height={ARROW_HEIGHT}
                  fillColor={theme.colors.popup.background.gray.intense}
                  strokeColor={
                    colorScheme === 'dark' ? theme.colors.popup.border.gray.intense : undefined
                  }
                />
              }
            >
              {content}
            </TooltipContent>
          </TouchableOpacity>
        </Portal>
      )}
    </TooltipContext.Provider>
  );
};

const Tooltip = assignWithoutSideEffects(_Tooltip, {
  componentId: componentIds.Tooltip,
});

export { Tooltip };
