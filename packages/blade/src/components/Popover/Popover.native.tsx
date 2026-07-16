/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { arrow, shift, useFloating, flip, offset } from '@floating-ui/react-native';
import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Portal } from '@gorhom/portal';
import { PopoverContent } from './PopoverContent';
import type { PopoverProps } from './types';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { PopoverContext } from './PopoverContext';
import { useFloatingPortal } from './useFloatingPortal.native';
import { componentIds } from './componentIds';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getFloatingPlacementParts } from '~utils/getFloatingPlacementParts';
import { mergeProps } from '~utils/mergeProps';
import { useControllableState } from '~utils/useControllable';
import { componentZIndices } from '~utils/componentZIndices';
import { useTheme } from '~components/BladeProvider';
import { PopupArrow } from '~components/PopupArrow';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

// Portal container rendered by @gorhom/portal has a 10px top offset on iOS relative
// to the window coordinate system that measureInWindow doesn't account for.
const IOS_OFFSET_CORRECTION = 10;

const _Popover = ({
  content,
  children,
  placement = 'top',
  onOpenChange,
  zIndex = componentZIndices.popover,
  title,
  titleLeading,
  footer,
  isOpen,
  defaultIsOpen,
}: PopoverProps): React.ReactElement => {
  const { theme } = useTheme();
  const defaultInitialFocusRef = React.useRef(null);
  const [controllableIsOpen, controllableSetIsOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: (isOpen) => onOpenChange?.({ isOpen }),
  });

  const gap = theme.spacing[2];
  const [side] = getFloatingPlacementParts(placement);
  const isHorizontal = side === 'left' || side === 'right';
  const arrowRef = React.useRef();

  const context = useFloating({
    sameScrollView: false,
    placement,
    middleware: [
      shift({ crossAxis: false, padding: gap }),
      flip({ padding: gap, fallbackAxisSideDirection: 'start' }),
      offset(gap + ARROW_HEIGHT),
      arrow({
        element: arrowRef,
        padding: isHorizontal ? 0 : ARROW_WIDTH,
      }),
    ],
  });

  const { refs, floatingStyles, update } = context;
  const [computedSide] = getFloatingPlacementParts(context.placement);

  const [isVisible, setIsVisible] = React.useState(() => controllableIsOpen);
  const { backdropRef, backdropOffset, onBackdropLayout } = useFloatingPortal(update, isVisible);

  // On React Native a tap fires both onTouchEnd and a press/click event.
  // Guard with a short debounce window so handleOpen (and thus onOpenChange)
  // only fires once per user gesture.
  const lastOpenCallRef = React.useRef(0);
  const handleOpen = React.useCallback(() => {
    const now = Date.now();
    if (now - lastOpenCallRef.current < 300) return;
    lastOpenCallRef.current = now;
    controllableSetIsOpen(() => true);
    onOpenChange?.({ isOpen: true });
  }, [controllableIsOpen, controllableSetIsOpen, onOpenChange]);

  const handleClose = React.useCallback(() => {
    controllableSetIsOpen(() => false);
    onOpenChange?.({ isOpen: false });
  }, [controllableSetIsOpen, onOpenChange]);

  // wait for animation to finish before unmounting
  React.useEffect(() => {
    const id = setTimeout(() => {
      if (!controllableIsOpen) {
        setIsVisible(false);
      }
    }, theme.motion.duration.gentle);

    if (controllableIsOpen) {
      setIsVisible(true);
    }
    return () => clearTimeout(id);
  }, [controllableIsOpen]);

  const contextValue = React.useMemo(() => {
    return {
      close: handleClose,
      defaultInitialFocusRef,
      titleId: undefined,
      openInteraction: 'click' as const,
    };
  }, [handleClose]);

  return (
    <PopoverContext.Provider value={contextValue}>
      {/* Cloning the trigger children to enhance it with ref and event handler.
           Button uses Pressable `onPress` (via `onClick`); `onTouchEnd` alone is
           unreliable inside ScrollView / ButtonGroup — real taps often only fire
           press. Attach both so Storybook and product taps open the popover.
           handleOpen debounces to prevent double-firing from both events. */}
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
          <PopoverContext.Provider value={contextValue}>
            <TouchableOpacity
              ref={backdropRef}
              onLayout={onBackdropLayout}
              style={StyleSheet.absoluteFill}
              onPress={handleClose}
              activeOpacity={1}
              testID="popover-modal-backdrop"
              {...metaAttribute({ name: MetaConstants.Popover })}
            >
              <PopoverContent
                titleLeading={titleLeading}
                title={title}
                footer={footer}
                isVisible={controllableIsOpen}
                ref={refs.setFloating}
                side={computedSide}
                style={{
                  ...floatingStyles,
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
                    fillColor={theme.colors.popup.background.subtle}
                    strokeColor={theme.colors.popup.border.subtle}
                  />
                }
              >
                {content}
              </PopoverContent>
            </TouchableOpacity>
          </PopoverContext.Provider>
        </Portal>
      )}
    </PopoverContext.Provider>
  );
};

const Popover = assignWithoutSideEffects(_Popover, {
  componentId: componentIds.Popover,
});

export { Popover };
