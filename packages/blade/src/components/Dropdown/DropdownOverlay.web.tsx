import React from 'react';
import throttle from 'lodash/throttle';
import styled, { keyframes, css } from 'styled-components';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { autoUpdate, detectOverflow, useFloating } from '@floating-ui/react';
import type { MiddlewareState } from '@floating-ui/react';
import type { DropdownPosition } from './dropdownUtils';
import { componentIds } from './dropdownUtils';
import { useDropdown } from './useDropdown';
import { StyledDropdownOverlay } from './StyledDropdownOverlay';
import type { DropdownOverlayProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
// Reading directly because its not possible to get theme object on top level to be used in keyframes
import { spacing, size } from '~tokens/global';
import type { SpacingValueType } from '~components/Box/BaseBox';
import { makeMotionTime, makeSize } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useBottomSheetAndDropdownGlue } from '~components/BottomSheet/BottomSheetContext';

const dropdownFadeIn = keyframes`
from {
  transform: translateY(${makeSize(spacing[0])});
  opacity: 0;
}

to {
  transform: translateY(${makeSize(spacing[3])});
  opacity: 1;
}
`;

const dropdownFadeOut = keyframes`
from {
  transform: translateY(${makeSize(spacing[3])});
  opacity: 1;
}

to {
  transform: translateY(${makeSize(spacing[0])});
  opacity: 0;
}
`;

const AnimatedOverlay = styled(StyledDropdownOverlay)<{
  transition: FlattenSimpleInterpolation;
  onAnimationEnd: () => void;
  isInBottomSheet?: boolean;
  isOpen: boolean;
}>(
  (props) =>
    css`
      ${props.transition}
      transform: translateY(${makeSize(props.theme.spacing[3])});
      opacity: 0;
      z-index: 99;
      pointer-events: ${props.isOpen ? 'all' : 'none'};
    `,
);

/**
 * This function calculates the position of dropdown overlay with respect to dropdown trigger element.
 * For non-menus (e.g SelectInput), position is flipped if overflow is on bottom.
 * For menus (e.g. DropdownButton), position is flipped if overflow is on right or bottom.
 * Additional spacing is added to clientHeight to provide spacing above the dropdown trigger.
 */
const getDropdownOverlayPosition = ({
  overflow: position,
  isMenu,
  triggererEl,
  actionListItemEl,
}: {
  overflow: { top: number; left: number; right: number; bottom: number };
  isMenu: boolean;
  triggererEl: HTMLButtonElement | null;
  actionListItemEl: HTMLDivElement | null;
}): DropdownPosition => {
  const zeroSpacing: SpacingValueType = 'spacing.0';
  const { top, bottom, right } = position;

  const newPosition: DropdownPosition = { left: zeroSpacing };

  /**
   * Calculating thresholds using the height & width of action list element with offset of 16px
   */
  const WIDTH_THRESHOLD = (Number(actionListItemEl?.clientWidth) + Number(size[16])) * -1;
  const HEIGHT_THRESHOLD = (Number(actionListItemEl?.clientHeight) + Number(size[16])) * -1;

  if (!isMenu) {
    // In SelectInput, we set position wrt to right so that leftLabel position can be accomodated
    // without additional offset calculation from left
    newPosition.left = undefined;
    newPosition.right = zeroSpacing;

    if (bottom > HEIGHT_THRESHOLD) {
      newPosition.bottom = `${Number(triggererEl?.clientHeight) + Number(size[32])}px`;
      newPosition.top = undefined;
    }

    if (top > HEIGHT_THRESHOLD) {
      newPosition.top = zeroSpacing;
      newPosition.bottom = undefined;
    }
    return newPosition;
  }

  if (right > WIDTH_THRESHOLD) {
    newPosition.right = zeroSpacing;
    newPosition.left = undefined;
  }

  if (bottom > HEIGHT_THRESHOLD) {
    newPosition.bottom = `${Number(triggererEl?.clientHeight) + Number(size[20])}px`;
    newPosition.top = undefined;
  }

  if (top > HEIGHT_THRESHOLD) {
    newPosition.top = zeroSpacing;
    newPosition.bottom = undefined;
  }

  return newPosition;
};

const getDropdownOverflowMiddleware = ({
  isMenu,
  triggererRef,
  actionListItemRef,
  setDropdownPosition,
}: {
  setDropdownPosition: React.Dispatch<React.SetStateAction<DropdownPosition>>;
  isMenu: boolean;
  triggererRef: React.RefObject<HTMLButtonElement | null>;
  actionListItemRef: React.RefObject<HTMLDivElement | null>;
}): { name: string; fn: (state: MiddlewareState) => Promise<object> } => {
  return {
    name: 'detectOverflowMiddleware',
    async fn(state: MiddlewareState) {
      const overflow = await detectOverflow(state, {
        elementContext: 'reference',
      });
      const position = getDropdownOverlayPosition({
        overflow,
        isMenu,
        triggererEl: triggererRef.current,
        actionListItemEl: actionListItemRef.current,
      });
      setDropdownPosition(position);
      return {};
    },
  };
};

/**
 * Overlay of dropdown
 *
 * Wrap your ActionList within this component
 */
const _DropdownOverlay = ({ children, testID }: DropdownOverlayProps): React.ReactElement => {
  const {
    isOpen,
    triggererRef,
    hasLabelOnLeft,
    dropdownTriggerer,
    setIsOpen,
    actionListItemRef,
  } = useDropdown();
  const { theme } = useTheme();
  const bottomSheetAndDropdownGlue = useBottomSheetAndDropdownGlue();
  const [showFadeOutAnimation, setShowFadeOutAnimation] = React.useState(false);
  const [width, setWidth] = React.useState<SpacingValueType>('100%');
  const [dropdownPosition, setDropdownPosition] = React.useState<DropdownPosition>({});

  const isMenu = dropdownTriggerer !== 'SelectInput';

  const { refs } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: 'absolute',
    placement: 'bottom-start',
    elements: {
      reference: triggererRef.current,
    },
    middleware: [
      getDropdownOverflowMiddleware({
        isMenu,
        triggererRef,
        actionListItemRef,
        setDropdownPosition,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const fadeIn = css`
    animation: ${dropdownFadeIn} ${makeMotionTime(theme.motion.duration.quick)}
      ${String(theme.motion.easing.entrance.revealing)};
  `;

  const fadeOut = css`
    animation: ${dropdownFadeOut} ${makeMotionTime(theme.motion.duration.quick)}
      ${String(theme.motion.easing.entrance.revealing)};
  `;

  const noAnimation = css`
    animation: none;
  `;

  React.useEffect(() => {
    if (isOpen) {
      // On Safari clicking on a non input element doesn't focuses it https://bugs.webkit.org/show_bug.cgi?id=22261
      triggererRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // We want to set width of overlay as per width of the SelectInput
  React.useEffect(() => {
    // We don't set width according to trigger when trigger is Button or other menu trigger
    if (isMenu) {
      return undefined;
    }

    const setOverlayWidth = throttle((): void => {
      if (triggererRef.current?.clientWidth && hasLabelOnLeft) {
        const svgWidth: number = size[16];
        const interactionElementPadding: number = theme.spacing[4];
        const offset = svgWidth + interactionElementPadding;
        // SelectInput is -> Button + InteractionElement on right (the chevron icon)
        // So we add the interactionElement offset with Button's width.
        setWidth(makeSize(triggererRef.current?.clientWidth + offset));
      } else {
        // We don't have to worry about setting the custom width when label is on top since we can just 100% width of parent div
        setWidth('100%');
        window.removeEventListener('resize', setOverlayWidth);
      }
    }, 1000);

    setOverlayWidth();
    window.addEventListener('resize', setOverlayWidth);
    return () => {
      window.removeEventListener('resize', setOverlayWidth);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setWidth, triggererRef, hasLabelOnLeft]);

  const onAnimationEnd = React.useCallback(() => {
    if (isOpen) {
      setShowFadeOutAnimation(true);
    } else {
      setShowFadeOutAnimation(false);
    }
  }, [isOpen]);

  const styles = React.useMemo(() => ({ opacity: isOpen ? 1 : 0 }), [isOpen]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <BaseBox position="relative" ref={refs.setFloating as any}>
      {isOpen ? (
        <BaseBox
          position={'fixed' as never}
          top="spacing.0"
          left="spacing.0"
          height="100%"
          width="100%"
          onClick={() => setIsOpen(false)}
        />
      ) : null}
      <AnimatedOverlay
        isInBottomSheet={bottomSheetAndDropdownGlue?.dropdownHasBottomSheet}
        width={isMenu ? 'max-content' : width}
        // In SelectInput, Overlay should always take width of Input
        minWidth={isMenu ? '240px' : undefined}
        // in SelectInput, we don't want to set maxWidth because it takes width according to the trigger
        maxWidth={isMenu ? '400px' : undefined}
        left={dropdownPosition.left}
        right={dropdownPosition.right}
        bottom={dropdownPosition.bottom}
        style={styles}
        isOpen={isOpen}
        position="absolute"
        transition={isOpen ? fadeIn : showFadeOutAnimation ? fadeOut : noAnimation}
        onAnimationEnd={onAnimationEnd}
        {...metaAttribute({ name: MetaConstants.DropdownOverlay, testID })}
      >
        {children}
      </AnimatedOverlay>
    </BaseBox>
  );
};

const DropdownOverlay = assignWithoutSideEffects(_DropdownOverlay, {
  componentId: componentIds.DropdownOverlay,
});

export { DropdownOverlay };
