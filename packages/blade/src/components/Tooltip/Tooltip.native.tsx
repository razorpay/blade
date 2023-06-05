/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { arrow, shift, useFloating, flip, offset } from '@floating-ui/react-native';
import React from 'react';
import { Modal, Pressable, TouchableOpacity } from 'react-native';
import { TooltipArrow } from './TooltipArrowNative';
import { TooltipContent } from './TooltipContent';
import { TooltipProps } from './types';
import { ARROW_HEIGHT } from './constants';
import { useTheme } from '~components/BladeProvider';

const Tooltip = ({
  content,
  children,
  onClose,
  onOpen,
  placement = 'left',
}: TooltipProps): React.ReactElement => {
  const { theme } = useTheme();
  const gap = theme.spacing[2];

  const [isOpen, setIsOpen] = React.useState(false);
  const arrowRef = React.useRef();
  const context = useFloating({
    sameScrollView: false,
    middleware: [
      flip(),
      shift({ padding: gap }),
      offset(gap + ARROW_HEIGHT),
      arrow({ element: arrowRef }),
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

  return (
    <>
      <Pressable
        style={{ alignSelf: 'flex-start' }}
        // TODO: check if we need onPress or onTouchStart
        onPress={handleOpen}
        ref={refs.setReference}
        collapsable={false}
        testID="tooltip-interactive-wrapper"
      >
        {children}
      </Pressable>
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
