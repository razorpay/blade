/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { arrow, shift, useFloating, flip, offset } from '@floating-ui/react-native';
import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { PopoverArrow } from './PopoverArrowNative';
import { PopoverContent } from './PopoverContent';
import type { PopoverProps } from './types';
import { ARROW_HEIGHT, ARROW_WIDTH, popoverZIndex } from './constants';
import { getPlacementParts } from './utils';
import { PopoverContext } from './PopoverContext';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { mergeProps } from '~utils/mergeProps';
import { useControllableState } from '~utils/useControllable';

const Popover = ({
  content,
  children,
  placement = 'top',
  onOpenChange,
  zIndex = popoverZIndex,
  headerTitle,
  headerLeading,
  footerContent,
  isOpen,
  defaultIsOpen,
  initialFocusRef,
}: PopoverProps): React.ReactElement => {
  const { theme } = useTheme();
  const defaultInitialFocusRef = React.useRef(null);
  const [controllableIsOpen, controllableSetIsOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultIsOpen,
    onChange: (isOpen) => onOpenChange?.({ isOpen }),
  });

  const gap = theme.spacing[2];
  const [side] = getPlacementParts(placement);
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

  const { refs, floatingStyles } = context;
  const [computedSide] = getPlacementParts(context.placement);

  const handleOpen = React.useCallback(() => {
    controllableSetIsOpen(() => true);
    onOpenChange?.({ isOpen: true });
  }, [controllableSetIsOpen, onOpenChange]);

  const handleClose = React.useCallback(() => {
    controllableSetIsOpen(() => false);
    onOpenChange?.({ isOpen: false });
  }, [controllableSetIsOpen, onOpenChange]);

  // wait for animation to finish before unmounting modal
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

  const contextValue = React.useMemo(() => {
    return {
      close: handleClose,
      defaultInitialFocusRef,
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
      {/* accessibilityLabel={content}  */}
      <Modal collapsable={false} transparent visible={isVisible}>
        <TouchableOpacity
          style={{
            flexShrink: 0,
            flex: 1,
          }}
          onPress={handleClose}
          activeOpacity={1}
          testID="popover-modal-backdrop"
          {...metaAttribute({ name: MetaConstants.Popover })}
        >
          <PopoverContent
            headerLeading={headerLeading}
            headerTitle={headerTitle}
            footerContent={footerContent}
            isVisible={controllableIsOpen}
            ref={refs.setFloating}
            side={computedSide}
            style={{
              ...floatingStyles,
              // TODO: Tokenize zIndex values
              zIndex,
            }}
            arrow={<PopoverArrow context={context} ref={arrowRef as never} />}
          >
            {content}
          </PopoverContent>
        </TouchableOpacity>
      </Modal>
    </PopoverContext.Provider>
  );
};

export { Popover };
