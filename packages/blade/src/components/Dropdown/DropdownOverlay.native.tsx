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
import { useButtonGroupContext } from '~components/ButtonGroup/ButtonGroupContext';
import { componentZIndices } from '~utils/componentZIndices';
import { size } from '~tokens/global';

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
const _DropdownOverlay = ({
  children,
  testID,
  width,
  minWidth,
  maxWidth,
  zIndex = componentZIndices.dropdownOverlay,
}: DropdownOverlayProps): React.ReactElement => {
  const { isOpen, close } = useDropdown();
  const { theme, colorScheme } = useTheme();
  const bottomSheetAndDropdownGlue = useBottomSheetAndDropdownGlue();
  const buttonGroupProps = useButtonGroupContext();
  // Split-button usage: the default closeable area uses height/width 100%, which
  // on RN resolves against the Storybook screen and blows ButtonGroup into a
  // tall vertical strip when the menu opens. Keep the overlay out of flex flow.
  const isInsideButtonGroup = buttonGroupProps.variant !== undefined;

  if (isInsideButtonGroup) {
    return (
      <BaseBox position="relative" zIndex={zIndex}>
        {/*
          Keep testID mounted for parity with the SelectInput path (tests assert
          display). Absolutely positioned so opening never changes ButtonGroup size.
        */}
        <AnimatedDropdownOverlay
          isInBottomSheet={bottomSheetAndDropdownGlue?.dropdownHasBottomSheet}
          colorScheme={colorScheme}
          display={isOpen ? 'flex' : 'none'}
          position="absolute"
          top="100%"
          right="0px"
          width={width}
          minWidth={minWidth ?? makeSize(size['200'])}
          maxWidth={maxWidth}
          testID="dropdown-overlay"
          elevation={bottomSheetAndDropdownGlue?.dropdownHasBottomSheet ? undefined : 'midRaised'}
          {...metaAttribute({ name: MetaConstants.DropdownOverlay, testID })}
        >
          {children}
        </AnimatedDropdownOverlay>
      </BaseBox>
    );
  }

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
          width={width ?? '100%'}
          minWidth={minWidth}
          maxWidth={maxWidth}
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
