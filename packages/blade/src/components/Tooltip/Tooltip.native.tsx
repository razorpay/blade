/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { Side } from '@floating-ui/react-native';
import { arrow, shift, useFloating, flip, offset } from '@floating-ui/react-native';
import React from 'react';
import { Modal, Pressable, TouchableOpacity } from 'react-native';
import { TooltipArrow } from './TooltipArrowNative';
import { TooltipContent } from './TooltipContent';
import { TooltipProps } from './types';
import { ARROW_HEIGHT, ARROW_WIDTH } from './constants';
import { useTheme } from '~components/BladeProvider';

const Tooltip = ({
  content,
  children,
  onClose,
  onOpen,
  placement = 'left',
  shouldWrapChildren,
}: TooltipProps): React.ReactElement => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const gap = theme.spacing[2];
  const [side] = placement.split('-') as [Side];
  const isHorizontal = side === 'left' || side === 'right';
  const arrowRef = React.useRef();
  const context = useFloating({
    sameScrollView: false,
    middleware: [
      flip(),
      shift({ padding: gap }),
      offset(gap + ARROW_HEIGHT),
      arrow({ element: arrowRef, padding: isHorizontal ? 0 : ARROW_WIDTH }),
    ],
    placement,
  });

  const { refs, floatingStyles } = context;

  const handleOpen = React.useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  // TODO: Do we need shouldWrapChildren in ReactNative?
  // We won't need to add shouldWrapChildren in RN, We will always wrap the children in a Pressable
  // Because even if we support direct childrens the tooltip won't behave as expected
  // In case if a interactive element is passed into it, Since we don't support long press event.
  // This is inline with design: In mobile if we put tooltip around a interactive element like button
  // that will be a wrong UX
  // if (shouldWrapChildren) {
  //   console.warn('[Blade Tooltip]: `shouldWrapChildren` prop does nothing on ReactNative');
  // }

  return (
    <>
      {shouldWrapChildren ? (
        <Pressable
          style={{ alignSelf: 'flex-start' }}
          // using touch end instead of start so that if the the children is interactive
          // it's events will get triggered also
          onTouchEnd={handleOpen}
          ref={refs.setReference}
          collapsable={false}
          testID="tooltip-interactive-wrapper"
        >
          {children}
        </Pressable>
      ) : (
        React.cloneElement(children, {
          onTouchEnd: handleOpen,
          ref: refs.setReference,
          style: { alignSelf: 'flex-start' },
        })
      )}

      <Modal
        accessibilityLabel={content}
        collapsable={false}
        transparent
        visible={isOpen}
        animationType="fade"
      >
        <TouchableOpacity
          style={{
            flexShrink: 0,
            flex: 1,
          }}
          onPress={handleClose}
          activeOpacity={1}
          testID="tooltip-modal-backdrop"
        >
          <TooltipContent
            ref={refs.setFloating}
            style={floatingStyles}
            arrow={<TooltipArrow context={context} ref={arrowRef as never} />}
          >
            {content}
          </TooltipContent>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export { Tooltip, TooltipProps };
