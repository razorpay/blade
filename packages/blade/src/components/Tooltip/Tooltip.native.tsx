/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { arrow, shift, useFloating, flip, offset } from '@floating-ui/react-native';
import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { TooltipArrow } from './TooltipArrowNative';
import { TooltipContent } from './TooltipContent';
import type { TooltipProps } from './types';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { getPlacementParts, mergeProps } from './utils';
import { ZIndex } from '~tokens/global';
import { TooltipContext } from './TooltipContext';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const Tooltip = ({
  content,
  children,
  placement = 'left',
  onOpenChange,
  zIndex,
}: TooltipProps): React.ReactElement => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const gap = theme.spacing[2];
  const [side] = getPlacementParts(placement);
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

  const { refs, floatingStyles } = context;

  const handleOpen = React.useCallback(() => {
    setIsOpen(true);
    onOpenChange?.({ isOpen: true });
  }, [onOpenChange]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    onOpenChange?.({ isOpen: false });
  }, [onOpenChange]);

  // wait for animation to finish before unmounting modal
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
      <Modal accessibilityLabel={content} collapsable={false} transparent visible={isVisible}>
        <TouchableOpacity
          style={{
            flexShrink: 0,
            flex: 1,
          }}
          onPress={handleClose}
          activeOpacity={1}
          testID="tooltip-modal-backdrop"
          {...metaAttribute({ name: MetaConstants.Tooltip })}
        >
          <TooltipContent
            isVisible={isOpen}
            ref={refs.setFloating}
            side={side}
            style={{
              ...floatingStyles,
              // To avoid flash of floating ui content at top, this only happens in RN <70
              // if the position is zero move the floating element outside of the viewport
              // this happens because measure is async and it takes few miliseconds to calculate the positions.
              left: floatingStyles.left || -200,
              top: floatingStyles.top || -200,
              zIndex: ZIndex[1000] + ZIndex[100],
            }}
            arrow={<TooltipArrow context={context} ref={arrowRef as never} />}
          >
            {content}
          </TooltipContent>
        </TouchableOpacity>
      </Modal>
    </TooltipContext.Provider>
  );
};

export { Tooltip };
