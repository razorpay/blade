import React from 'react';
import { DropdownContext } from './useDropdown';
import type { DropdownContextType } from './useDropdown';
import { componentIds } from './dropdownUtils';
import { useId } from '~src/hooks/useId';
import { isValidAllowedChildren } from '~utils';

type DropdownProps = {
  selectionType?: 'single' | 'multiple';
  children: React.ReactNode[];
};

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

  let dropdownTriggerer: DropdownContextType['dropdownTriggerer'];

  React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (
        !isValidAllowedChildren(child, 'SelectInput') &&
        !isValidAllowedChildren(child, componentIds.DropdownOverlay)
      ) {
        throw new Error(
          `[Dropdown]: Dropdown can only have \`SelectInput\` and \`DropdownOverlay\` as children\n\n Check out: https://blade.razorpay.com/?path=/story/components-dropdown`,
        );
      }

      if (isValidAllowedChildren(child, 'SelectInput')) {
        dropdownTriggerer = 'SelectInput';
      }
    }
  });

  const contextValue = React.useMemo<DropdownContextType>(
    () => ({
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
      dropdownTriggerer,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isOpen,
      selectedIndices,
      options,
      activeIndex,
      shouldIgnoreBlur,
      selectionType,
      optionsRecalculateToggle,
      hasFooterAction,
    ],
  );

  return <DropdownContext.Provider value={contextValue}>{children}</DropdownContext.Provider>;
}

Dropdown.componentId = componentIds.Dropdown;

export { Dropdown, DropdownProps };
