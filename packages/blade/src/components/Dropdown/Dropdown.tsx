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
    <Box
      as={!isReactNative ? 'div' : undefined}
      style={{ display: isOpen ? (isReactNative ? 'flex' : 'block') : 'none' }}
      tabIndex={-1}
    >
      {children}
    </Box>
  );
}

export { Dropdown, DropdownOverlay, DropdownProps };
