import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { useDropdown } from './useDropdown';
import { StyledDropdownOverlay } from './StyledDropdownOverlay';
import type { DropdownOverlayProps } from './types';
import { dropdownComponentIds } from './dropdownComponentIds';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { castNativeType, makeSize } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useBottomSheetAndDropdownGlue } from '~components/BottomSheet/BottomSheetContext';

const AnimatedDropdownOverlay = styled(StyledDropdownOverlay)<{ testID: 'dropdown-overlay' }>(
  (props) => ({
    transform: `translateY(${makeSize(props.theme.spacing[3])})`,
  }),
);

const StyledCloseableArea = styled(Pressable)<{ display: 'flex' | 'none' }>((props) => ({
  position: 'static',
  height: '100%',
  width: '100%',
  display: props.display,
}));

/**
 * Overlay of dropdown
 *
 * Wrap your ActionList within this component
 */
const _DropdownOverlay = ({ children, testID }: DropdownOverlayProps): React.ReactElement => {
  const { isOpen, close } = useDropdown();
  const { theme, colorScheme } = useTheme();
  const bottomSheetAndDropdownGlue = useBottomSheetAndDropdownGlue();

  const hasBottomSheet = bottomSheetAndDropdownGlue?.dropdownHasBottomSheet;

  return (
    <BaseBox position="relative">
      <StyledCloseableArea
        display={isOpen ? 'flex' : 'none'}
        onPress={() => {
          close();
        }}
        testID="closeable-area"
      >
        <AnimatedDropdownOverlay
          isInBottomSheet={hasBottomSheet}
          colorScheme={colorScheme}
          display={isOpen ? 'flex' : 'none'}
          position="absolute"
          width="100%"
          testID="dropdown-overlay"
          elevation={hasBottomSheet ? undefined : 'midRaised'}
          // Native shadow props (shadowColor/Opacity/Radius/Offset + Android elevation) must be
          // applied via the raw style prop — styled-components mangles the shadowOffset object.
          // Mirrors the Tooltip/Carousel native elevation pattern. The overlay already carries an
          // opaque background and no overflow:hidden, so the iOS shadow isn't clipped.
          style={hasBottomSheet ? undefined : castNativeType(theme.elevation.midRaised)}
          {...metaAttribute({ name: MetaConstants.DropdownOverlay, testID })}
        >
          {children}
        </AnimatedDropdownOverlay>
      </StyledCloseableArea>
    </BaseBox>
  );
};

const DropdownOverlay = assignWithoutSideEffects(_DropdownOverlay, {
  componentId: dropdownComponentIds.DropdownOverlay,
});

export { DropdownOverlay };
