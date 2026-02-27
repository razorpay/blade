import React from 'react';
import styled from 'styled-components';
import {
  FloatingFocusManager,
  FloatingPortal,
  FloatingOverlay,
  useFloating,
  useDismiss,
  useInteractions,
} from '@floating-ui/react';
import usePresence from 'use-presence';
import { LightBoxProvider } from './LightBoxContext';
import type { LightBoxProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { componentZIndices } from '~utils/componentZIndices';
import { useControllableState } from '~utils/useControllable';
import { makeMotionTime } from '~utils/makeMotionTime';
import { castWebType } from '~utils/platform/castUtils';
import { IconButton } from '~components/Button/IconButton';
import { useTheme } from '~components/BladeProvider';
import { Box } from '~components/Box';
import { BaseBox } from '~components/Box/BaseBox';
import { CloseIcon } from '~components/Icons';

const StyledBackdrop = styled(FloatingOverlay)<{ $isVisible: boolean }>(
  ({ theme, $isVisible }) => ({
    backgroundColor: theme.colors.overlay.background.subtle,
    transitionProperty: 'opacity',
    backdropFilter: `blur(${theme.backdropBlur.high}px)`,
    transitionDuration: `${makeMotionTime(theme.motion.duration.moderate)}`,
    transitionTimingFunction: $isVisible
      ? castWebType(theme.motion.easing.entrance)
      : castWebType(theme.motion.easing.exit),
    opacity: $isVisible ? 1 : 0,
  }),
);

const StyledLightBoxContent = styled(BaseBox)<{ $isVisible: boolean }>(({ theme, $isVisible }) => ({
  opacity: $isVisible ? 1 : 0,
  transitionProperty: 'opacity',
  transitionDuration: `${makeMotionTime(theme.motion.duration.moderate)}`,
  transitionTimingFunction: $isVisible
    ? castWebType(theme.motion.easing.entrance)
    : castWebType(theme.motion.easing.exit),
}));

type LightBoxBackdropProps = {
  isVisible: boolean;
};

const LightBoxBackdrop = ({ isVisible }: LightBoxBackdropProps): React.ReactElement => (
  <StyledBackdrop $isVisible={isVisible} lockScroll={true} />
);

const _LightBox = ({
  isOpen,
  onDismiss,
  activeIndex: activeIndexProp,
  defaultActiveIndex,
  onIndexChange,
  accessibilityLabel = 'Media viewer',
  children,
}: LightBoxProps): React.ReactElement => {
  const { theme } = useTheme();
  const { isMounted, isVisible } = usePresence(isOpen, {
    transitionDuration: theme.motion.duration.moderate,
    initialEnter: true,
  });

  const [activeIndex, setActiveIndex] = useControllableState({
    value: activeIndexProp,
    defaultValue: defaultActiveIndex ?? 0,
    onChange: (index) => {
      onIndexChange?.({ index });
    },
  });

  const handleIndexChange = (index: number): void => {
    setActiveIndex(() => index);
  };

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) onDismiss?.();
    },
  });

  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);
  const defaultInitialFocusRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <LightBoxProvider value={{ activeIndex, handleIndexChange }}>
      <FloatingPortal>
        {isMounted ? (
          <Box position="fixed" zIndex={componentZIndices.modal}>
            <LightBoxBackdrop isVisible={isVisible} />
            <FloatingFocusManager
              returnFocus
              initialFocus={defaultInitialFocusRef}
              context={context}
              modal={true}
            >
              <StyledLightBoxContent
                ref={refs.setFloating}
                {...getFloatingProps()}
                $isVisible={isVisible}
                role="dialog"
                aria-label={accessibilityLabel}
                aria-modal={true}
                position="fixed"
                top="spacing.0"
                right="spacing.0"
                bottom="spacing.0"
                left="spacing.0"
                display="flex"
                height="100%"
                width="100%"
                alignItems="center"
                justifyContent="center"
                padding="spacing.6"
                onClick={() => {
                  onDismiss?.();
                }}
              >
                <Box position="absolute" top="spacing.6" right="spacing.6" zIndex={1}>
                  <IconButton
                    ref={defaultInitialFocusRef}
                    icon={CloseIcon}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onClick={() => {}} // onClick of parent already handles dismiss
                    accessibilityLabel="Close lightbox"
                    emphasis="subtle"
                    size="large"
                  />
                </Box>
                <BaseBox position="relative" height="100%" width="100%">
                  {children}
                </BaseBox>
              </StyledLightBoxContent>
            </FloatingFocusManager>
          </Box>
        ) : null}
      </FloatingPortal>
    </LightBoxProvider>
  );
};

const LightBox = assignWithoutSideEffects(_LightBox, {
  displayName: 'LightBox',
});

export { LightBox };
