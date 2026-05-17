/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { arrow, shift, useFloating, flip, offset } from '@floating-ui/react-native';
import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Portal } from '@gorhom/portal';
import { PopoverContent } from './PopoverContent';
import type { PopoverProps } from './types';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { PopoverContext } from './PopoverContext';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { mergeProps } from '~utils/mergeProps';
import { useControllableState } from '~utils/useControllable';
import { PopupArrow } from '~components/PopupArrow';
import { getFloatingPlacementParts } from '~utils/getFloatingPlacementParts';
import { componentZIndices } from '~utils/componentZIndices';

const IOS_OFFSET_CORRECTION = 10;

const Popover = ({
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
  const backdropRef = React.useRef<TouchableOpacity>(null);
  const [backdropOffset, setBackdropOffset] = React.useState({ x: 0, y: 0 });

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

  // Measure the Portal backdrop's window position to correct coordinate mismatch
  // between measureInWindow (used by floating-ui) and the Portal container's coordinate space
  const onBackdropLayout = React.useCallback(() => {
    if (backdropRef.current && 'measureInWindow' in backdropRef.current) {
      ((backdropRef.current as unknown) as { measureInWindow: Function }).measureInWindow(
        (bx: number, by: number) => {
          setBackdropOffset({ x: bx || 0, y: by || 0 });
        },
      );
    }
  }, []);

  const handleOpen = React.useCallback(() => {
    controllableSetIsOpen(() => true);
    onOpenChange?.({ isOpen: true });
  }, [controllableSetIsOpen, onOpenChange]);

  const handleClose = React.useCallback(() => {
    controllableSetIsOpen(() => false);
    onOpenChange?.({ isOpen: false });
  }, [controllableSetIsOpen, onOpenChange]);

  // wait for animation to finish before unmounting
  const [isVisible, setIsVisible] = React.useState(() => controllableIsOpen);
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

  // Re-run floating position computation after backdrop offset is measured
  React.useEffect(() => {
    if (isVisible && (backdropOffset.x !== 0 || backdropOffset.y !== 0)) {
      const id = setTimeout(() => {
        update();
      }, 50);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [backdropOffset, isVisible, update]);

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
      {/* Cloning the trigger children to enhance it with ref and event handler */}
      {React.cloneElement(children, {
        ...mergeProps(
          {
            onTouchEnd: children.props.onTouchEnd,
          },
          { onTouchEnd: handleOpen },
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
        </Portal>
      )}
    </PopoverContext.Provider>
  );
};

export { Popover };
