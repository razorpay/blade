import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { FloatingFocusManager, useFloating } from '@floating-ui/react';
import usePresence from 'use-presence';
import { ModalPortal } from './ModalPortal';
import { ModalHeader } from './ModalHeader';
import type { ModalHeaderProps } from './ModalHeader';
import { ModalFooter } from './ModalFooter';
import type { ModalFooterProps } from './ModalFooter';
import { ModalBody } from './ModalBody';
import type { ModalBodyProps } from './ModalBody';
import { ModalContext } from './ModalContext';
import { ModalBackdrop } from './ModalBackdrop';
import {
  modalBorderRadius,
  modalMaxHeight,
  modalMaxWidth,
  modalMinWidth,
  modalResponsiveScreenGap,
} from './modalTokens';
import {
  MetaConstants,
  castWebType,
  isValidAllowedChildren,
  makeMotionTime,
  makeSize,
  metaAttribute,
} from '~utils';
import { BaseBox } from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';

const entry = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) translateY(0px);
  }
`;

const exit = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) translateY(0px);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9) translateY(20px);
  }
`;

const ModalContent = styled(BaseBox)<{ isVisible: boolean }>(({ isVisible, theme }) => {
  return css`
    transform: translate(-50%, -50%);
    opacity: ${isVisible ? 1 : 0};
    animation: ${isVisible ? entry : exit}
      ${castWebType(makeMotionTime(theme.motion.duration.xmoderate))}
      ${
        isVisible
          ? castWebType(theme.motion.easing.entrance.revealing)
          : castWebType(theme.motion.easing.exit.revealing)
      }};
  `;
});

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onDismiss: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialFocusRef?: React.MutableRefObject<any>;
  size?: 'small' | 'medium' | 'large';
  // accessibilityLabel?: string;
};

const Modal = ({
  isOpen = false,
  children,
  onDismiss,
  initialFocusRef,
  size = 'small',
}: ModalProps): React.ReactElement => {
  const { theme } = useTheme();
  const { isMounted, isVisible } = usePresence(isOpen, {
    transitionDuration: 1000,
    initialEnter: true,
  });
  const { refs, context } = useFloating({
    open: isMounted,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultInitialFocusRef = React.useRef<any>(null);

  const originalFocusElement = React.useRef<HTMLElement | null>(null);
  const returnFocus = React.useCallback(() => {
    if (!originalFocusElement.current) return;
    originalFocusElement.current.focus();
    // After returning focus we will clear the original focus
    // Because if modal can be opened up via multiple triggers
    // We want to ensure the focus returns back to the most recent triggerer
    originalFocusElement.current = null;
  }, [originalFocusElement]);

  const focusOnInitialRef = React.useCallback(() => {
    if (!initialFocusRef) {
      // focus on close button
      defaultInitialFocusRef.current?.focus();
    } else {
      // focus on the initialRef passed by the user
      initialFocusRef.current?.focus();
    }
  }, [initialFocusRef]);

  React.useEffect(() => {
    if (isOpen) {
      // set the original focus element where the focus will return to after closing the modal
      originalFocusElement.current =
        originalFocusElement.current ?? (document.activeElement as HTMLElement);
      // focus on an element on Modal, if initialFocusRef is not passed, focus on the close button
      focusOnInitialRef();
    }
  }, [isOpen, focusOnInitialRef]);

  React.useEffect(() => {
    if (!isOpen) {
      returnFocus();
    }
  }, [isOpen, returnFocus]);
  const modalContext = React.useMemo(
    () => ({
      isOpen,
      close: onDismiss,
      defaultInitialFocusRef,
      isVisible,
    }),
    [isOpen, onDismiss, defaultInitialFocusRef, isVisible],
  );
  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event?.key === 'Escape' || event?.code === 'Escape') {
      onDismiss();
    }
  };
  const validChildren = React.Children.map(children, (child) => {
    if (
      isValidAllowedChildren(child, MetaConstants.ModalHeader) ||
      isValidAllowedChildren(child, MetaConstants.ModalBody) ||
      isValidAllowedChildren(child, MetaConstants.ModalFooter)
    ) {
      return child;
    } else {
      throw new Error(
        '[Blade Modal] Modal only accepts ModalHeader, ModalBody and ModalFooter as children',
      );
    }
  });

  return (
    <ModalPortal>
      <ModalContext.Provider value={modalContext}>
        {isMounted ? (
          <FloatingFocusManager context={context} modal={true}>
            <>
              <ModalBackdrop />
              <ModalContent
                {...metaAttribute({
                  name: MetaConstants.Modal,
                })}
                maxWidth={makeSize(modalMaxWidth[size])}
                minWidth={makeSize(modalMinWidth)}
                maxHeight={modalMaxHeight}
                width={`calc(100vw - ${makeSize(modalResponsiveScreenGap)})`}
                borderRadius={modalBorderRadius}
                backgroundColor={theme.colors.surface.background.level2.lowContrast}
                position="absolute"
                display="flex"
                flexDirection="column"
                top="50%"
                left="50%"
                onKeyDown={handleKeyDown}
                isVisible={isVisible}
                ref={refs.setFloating}
              >
                {validChildren}
              </ModalContent>
            </>
          </FloatingFocusManager>
        ) : null}
      </ModalContext.Provider>
    </ModalPortal>
  );
};

export { Modal, ModalHeader, ModalFooter, ModalBody };
export type { ModalProps, ModalHeaderProps, ModalFooterProps, ModalBodyProps };
