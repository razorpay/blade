/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { arrow, shift, useFloating, flip, offset } from '@floating-ui/react-native';
import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { PopoverContent } from './PopoverContent';
import type { PopoverProps } from './types';
import { ARROW_HEIGHT, ARROW_WIDTH, popoverZIndex } from './constants';
import { PopoverContext } from './PopoverContext';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { mergeProps } from '~utils/mergeProps';
import { useControllableState } from '~utils/useControllable';
import { PopupArrow } from '~components/PopupArrow';
import { getFloatingPlacementParts } from '~utils/getFloatingPlacementParts';

const Popover = ({
  content,
  children,
  placement = 'top',
  onOpenChange,
  zIndex = popoverZIndex,
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

  const { refs, floatingStyles } = context;
  const [computedSide] = getFloatingPlacementParts(context.placement);

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
      titleId: undefined,
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
      <Modal
        collapsable={false}
        transparent
        visible={Boolean(isVisible)}
        {...metaAttribute({ testID: 'popover-modal' })}
      >
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
          onPress={handleClose}
          activeOpacity={1}
          testID="popover-modal-backdrop"
          {...metaAttribute({ name: MetaConstants.Popover })}
        />
        <PopoverContent
          titleLeading={titleLeading}
          title={title}
          footer={footer}
          isVisible={controllableIsOpen}
          ref={refs.setFloating}
          side={computedSide}
          style={{
            ...floatingStyles,
            // TODO: Tokenize zIndex values
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
      </Modal>
    </PopoverContext.Provider>
  );
};

export { Popover };
