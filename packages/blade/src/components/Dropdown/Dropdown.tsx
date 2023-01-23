import React from 'react';
import { DropdownContext, useDropdown } from './useDropdown';
import type { DropdownContextType } from './useDropdown';
import { useId } from '~src/hooks/useId';
import Box from '~components/Box';
import { getPlatformType } from '~utils';

type DropdownProps = {
  selectionType?: 'single' | 'multiple';
  children: React.ReactNode[];
};

const platformType = getPlatformType();
const isReactNative = platformType === 'react-native';

/**
 * **Dropdown component**
 *
 * **Usage**
 *
 * ```jsx
 * <Dropdown selectionType="single">
 *  <SelectInput />
 *  <DropdownOverlay>
 *    <ActionList>
 *      <ActionListItem />
 *      <ActionListItem />
 *    </ActionList>
 *  </DropdownOverlay>
 * </Dropdown>
 * ```
 */
function Dropdown({ children, selectionType = 'single' }: DropdownProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState<DropdownContextType['options']>([]);
  const [selectedIndices, setSelectedIndices] = React.useState<
    DropdownContextType['selectedIndices']
  >([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [shouldIgnoreBlur, setShouldIgnoreBlur] = React.useState(false);
  const selectInputRef = React.useRef<HTMLButtonElement>(null);
  const actionListRef = React.useRef<HTMLDivElement>(null);
  const [hasFooterAction, setHasFooterAction] = React.useState(false);
  const [optionsRecalculateToggle, setOptionsRecalculateToggle] = React.useState(false);

  const recalculateOptions = (): void => {
    setOptionsRecalculateToggle(!optionsRecalculateToggle);
  };

  const dropdownBaseId = useId('dropdown');

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        setIsOpen,
        selectedIndices,
        setSelectedIndices,
        options,
        setOptions,
        activeIndex,
        setActiveIndex,
        shouldIgnoreBlur,
        setShouldIgnoreBlur,
        dropdownBaseId,
        selectInputRef,
        actionListRef,
        selectionType,
        hasFooterAction,
        setHasFooterAction,
        recalculateOptions,
        optionsRecalculateToggle,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

/**
 * Overlay for dropdown.
 *
 * Wrap your ActionList with this this component
 */
function DropdownOverlay({ children }: { children: React.ReactNode }): JSX.Element {
  const { isOpen } = useDropdown();

  return (
    <Box position="relative">
      <Box
        as={!isReactNative ? 'div' : undefined}
        display={isOpen ? (isReactNative ? 'flex' : 'block') : 'none'}
        position="absolute"
        width="100%"
      >
        {children}
      </Box>
    </Box>
  );
}

export { Dropdown, DropdownOverlay, DropdownProps };
