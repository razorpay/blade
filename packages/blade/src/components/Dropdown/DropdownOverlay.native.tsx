import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { componentIds } from './dropdownUtils';
import { useDropdown } from './useDropdown';
import { StyledDropdownOverlay } from './StyledDropdownOverlay';
import type { DropdownOverlayProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';
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
  const bottomSheetAndDropdownGlue = useBottomSheetAndDropdownGlue();

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
          isInBottomSheet={bottomSheetAndDropdownGlue?.dropdownHasBottomSheet}
          display={isOpen ? 'flex' : 'none'}
          position="absolute"
          width="100%"
          testID="dropdown-overlay"
          elevation={bottomSheetAndDropdownGlue?.dropdownHasBottomSheet ? undefined : 'midRaised'}
          {...metaAttribute({ name: MetaConstants.DropdownOverlay, testID })}
        >
          {children}
        </AnimatedDropdownOverlay>
      </StyledCloseableArea>
    </BaseBox>
  );
};

const DropdownOverlay = assignWithoutSideEffects(_DropdownOverlay, {
  componentId: componentIds.DropdownOverlay,
});

export { DropdownOverlay };
