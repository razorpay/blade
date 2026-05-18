/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { arrow, shift, useFloating, flip, offset } from '@floating-ui/react-native';
import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Portal } from '@gorhom/portal';
import { TooltipContent } from './TooltipContent';
import type { TooltipProps } from './types';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { TooltipContext } from './TooltipContext';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { mergeProps } from '~utils/mergeProps';
import { PopupArrow } from '~components/PopupArrow';
import { getFloatingPlacementParts } from '~utils/getFloatingPlacementParts';
import { componentZIndices } from '~utils/componentZIndices';

const IOS_OFFSET_CORRECTION = 10;

const Tooltip = ({
  title,
  content,
  children,
  placement = 'left',
  onOpenChange,
  zIndex = componentZIndices.tooltip,
}: TooltipProps): React.ReactElement => {
  const { theme, colorScheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

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
      flip({ padding: gap }),
      offset(gap + ARROW_HEIGHT),
      arrow({
        element: arrowRef,
        padding: isHorizontal ? 0 : ARROW_WIDTH,
      }),
    ],
  });

  const { refs, floatingStyles, update } = context;

  // Measure the Portal backdrop's window position to correct coordinate mismatch
  // between measureInWindow (used by floating-ui) and the Portal container's coordinate space
  const onBackdropLayout = React.useCallback(() => {
    if (backdropRef.current && 'measureInWindow' in backdropRef.current) {
      ((backdropRef.current as unknown) as {
        measureInWindow: (cb: (x: number, y: number, w: number, h: number) => void) => void;
      }).measureInWindow((bx: number, by: number) => {
        setBackdropOffset({ x: bx || 0, y: by || 0 });
      });
    }
  }, []);

  const handleOpen = React.useCallback(() => {
    setIsOpen(true);
    onOpenChange?.({ isOpen: true });
  }, [onOpenChange]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    onOpenChange?.({ isOpen: false });
  }, [onOpenChange]);

  // wait for animation to finish before unmounting
  const [isVisible, setIsVisible] = React.useState(() => isOpen);
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

  return (
    <TooltipContext.Provider value={true}>
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
            testID="tooltip-modal-backdrop"
            {...metaAttribute({ name: MetaConstants.Tooltip })}
          >
            <TooltipContent
              title={title}
              isVisible={isOpen}
              ref={refs.setFloating}
              side={side}
              colorScheme={colorScheme}
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
                  strokeColor={theme.colors.popup.border.gray.intense}
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

export { Tooltip };
