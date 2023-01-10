import React from 'react';
import { DropdownContext, useDropdown } from './useDropdown';
import type { DropdownContextType } from './useDropdown';

type DropdownProps = {
  selectionType?: 'single' | 'multiple';
  children: React.ReactNode[];
};

function Dropdown({ children, selectionType }: DropdownProps): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState<DropdownContextType['options']>([]);
  const [selectedIndices, setSelectedIndices] = React.useState<
    DropdownContextType['selectedIndices']
  >([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [shouldIgnoreBlur, setShouldIgnoreBlur] = React.useState(false);
  const selectInputRef = React.useRef<HTMLButtonElement>(null);
  const actionListRef = React.useRef<HTMLDivElement>(null);

  // @TODO: replace this with some id generation method
  const dropdownBaseId = 'dropdown-1';

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

function DropdownOverlay({ children }: { children: React.ReactNode }): JSX.Element {
  const { isOpen } = useDropdown();

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }} tabIndex={-1}>
      {children}
    </div>
  );
}

export { Dropdown, DropdownOverlay, DropdownProps };
