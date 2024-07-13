import React from 'react';
import {
  autoUpdate,
  offset,
  size as sizeMiddleware,
  useFloating,
  useTransitionStyles,
  flip,
  FloatingPortal,
  useDismiss,
  useInteractions,
} from '@floating-ui/react';
import { useDropdown } from './useDropdown';
import { StyledDropdownOverlay } from './StyledDropdownOverlay';
import type { DropdownOverlayProps } from './types';
import { dropdownComponentIds } from './dropdownComponentIds';
import { useTheme } from '~components/BladeProvider';
// Reading directly because its not possible to get theme object on top level to be used in keyframes
import { size } from '~tokens/global';
import { makeSize } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useBottomSheetAndDropdownGlue } from '~components/BottomSheet/BottomSheetContext';
import BaseBox from '~components/Box/BaseBox';
import { componentZIndices } from '~utils/componentZIndices';
import { OVERLAY_OFFSET, OVERLAY_TRANSITION_OFFSET } from '~components/BaseMenu/tokens';

const OVERLAY_PADDING: number = size['12']; // doesn't have to be exact. Just rough padding for floating ui to decide to show overlay on top or bottom

/**
 * Overlay of dropdown
 *
 * Wrap your ActionList within this component
 */
const _DropdownOverlay = ({
  children,
  testID,
  zIndex = componentZIndices.dropdownOverlay,
  width,
  minWidth,
  maxWidth,
  referenceRef,
  defaultPlacement = 'bottom-start',
}: DropdownOverlayProps): React.ReactElement | null => {
  const { isOpen, triggererRef, triggererWrapperRef, dropdownTriggerer, setIsOpen } = useDropdown();
  const { theme } = useTheme();
  const bottomSheetAndDropdownGlue = useBottomSheetAndDropdownGlue();

  const isMenu =
    dropdownTriggerer !== dropdownComponentIds.triggers.SelectInput &&
    dropdownTriggerer !== dropdownComponentIds.triggers.SearchInput &&
    dropdownTriggerer !== dropdownComponentIds.triggers.AutoComplete &&
    referenceRef == undefined;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: 'fixed',
    placement: defaultPlacement,
    elements: {
      // Input triggers have their ref on internal input element but we want width height of overall visible input hence wrapperRef is needed
      // We fallback to use `triggererRef` for triggers like button and link where wrapper is not needed
      // Checkout: https://github.com/razorpay/blade/pull/1559#discussion_r1305438920
      reference: (referenceRef?.current ??
        triggererWrapperRef.current ??
        triggererRef.current) as Element,
    },
    middleware: [
      offset({
        mainAxis: OVERLAY_OFFSET,
      }),
      flip({
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        padding: OVERLAY_OFFSET + OVERLAY_PADDING,
      }),
      sizeMiddleware({
        apply({ rects, elements }) {
          const overlayWidth = isMenu ? undefined : makeSize(rects.reference.width);
          const overlayMinWidth = isMenu ? makeSize(size['240']) : undefined;
          const overlayMaxWidth = isMenu ? makeSize(size['400']) : undefined;

          Object.assign(elements.floating.style, {
            // in menu, we have flexible width between min and max
            // in input triggers, we just take width of trigger
            width: width ?? overlayWidth,
            minWidth: minWidth ?? overlayMinWidth,
            maxWidth: maxWidth ?? overlayMaxWidth,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const { getFloatingProps } = useInteractions([dismiss]);

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: theme.motion.duration.quick,
    initial: () => ({
      transform: `translateY(-${makeSize(OVERLAY_TRANSITION_OFFSET)})`,
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
    <FloatingPortal>
      <BaseBox
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={refs.setFloating as any}
        style={floatingStyles}
        zIndex={zIndex}
        display={isMounted ? 'flex' : 'none'}
        {...getFloatingProps()}
      >
        <StyledDropdownOverlay
          isInBottomSheet={bottomSheetAndDropdownGlue?.dropdownHasBottomSheet}
          elevation={bottomSheetAndDropdownGlue?.dropdownHasBottomSheet ? undefined : 'midRaised'}
          style={{ ...styles }}
          width={width ? width : '100%'}
          minWidth={minWidth}
          maxWidth={maxWidth}
          {...metaAttribute({ name: MetaConstants.DropdownOverlay, testID })}
        >
          {children}
        </StyledDropdownOverlay>
      </BaseBox>
    </FloatingPortal>
  );
};

const DropdownOverlay = assignWithoutSideEffects(_DropdownOverlay, {
  componentId: dropdownComponentIds.DropdownOverlay,
});

export { DropdownOverlay };
