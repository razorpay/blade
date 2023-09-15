import React from 'react';
import {
  autoUpdate,
  offset,
  size as sizeMiddleware,
  useFloating,
  useTransitionStyles,
  flip,
} from '@floating-ui/react';
import { componentIds } from './dropdownUtils';
import { useDropdown } from './useDropdown';
import { StyledDropdownOverlay } from './StyledDropdownOverlay';
import type { DropdownOverlayProps } from './types';
import { useTheme } from '~components/BladeProvider';
// Reading directly because its not possible to get theme object on top level to be used in keyframes
import { size } from '~tokens/global';
import { makeSize } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useBottomSheetAndDropdownGlue } from '~components/BottomSheet/BottomSheetContext';
import BaseBox from '~components/Box/BaseBox';

const OVERLAY_OFFSET: number = size['8'];
const OVERLAY_PADDING: number = size['12']; // doesn't have to be exact. Just rough padding for floating ui to decide to show overlay on top or bottom
const OVERLAY_ZINDEX = 1001;

/**
 * Overlay of dropdown
 *
 * Wrap your ActionList within this component
 */
const _DropdownOverlay = ({
  children,
  testID,
  zIndex = OVERLAY_ZINDEX,
}: DropdownOverlayProps): React.ReactElement | null => {
  const { isOpen, triggererRef, triggererWrapperRef, dropdownTriggerer, setIsOpen } = useDropdown();
  const { theme } = useTheme();
  const bottomSheetAndDropdownGlue = useBottomSheetAndDropdownGlue();

  const isMenu = dropdownTriggerer !== 'SelectInput';

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: 'fixed',
    placement: 'bottom-start',
    elements: {
      // Input triggers have their ref on internal input element but we want width height of overall visible input hence wrapperRef is needed
      // We fallback to use `triggererRef` for triggers like button and link where wrapper is not needed
      // Checkout: https://github.com/razorpay/blade/pull/1559#discussion_r1305438920
      reference: triggererWrapperRef.current ?? triggererRef.current,
    },
    middleware: [
      offset({
        mainAxis: OVERLAY_OFFSET,
      }),
      flip({
        padding: OVERLAY_OFFSET + OVERLAY_PADDING,
      }),
      sizeMiddleware({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            // in menu, we have flexible width between min and max
            // in input triggers, we just take width of trigger
            width: isMenu ? undefined : makeSize(rects.reference.width),
            minWidth: isMenu ? makeSize(size['240']) : undefined,
            maxWidth: isMenu ? makeSize(size['400']) : undefined,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: theme.motion.duration.quick,
    initial: () => ({
      transform: `translateY(-${makeSize(size['8'])})`,
      opacity: 0,
    }),
  });

  React.useEffect(() => {
    if (isOpen) {
      // On Safari clicking on a non input element doesn't focuses it https://bugs.webkit.org/show_bug.cgi?id=22261
      triggererRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <BaseBox
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={refs.setFloating as any}
      style={floatingStyles}
      zIndex={zIndex}
      display={isMounted ? 'flex' : 'none'}
    >
      <StyledDropdownOverlay
        isInBottomSheet={bottomSheetAndDropdownGlue?.dropdownHasBottomSheet}
        style={{ ...styles }}
        width="100%"
        {...metaAttribute({ name: MetaConstants.DropdownOverlay, testID })}
      >
        {children}
      </StyledDropdownOverlay>
    </BaseBox>
  );
};

const DropdownOverlay = assignWithoutSideEffects(_DropdownOverlay, {
  componentId: componentIds.DropdownOverlay,
});

export { DropdownOverlay };
