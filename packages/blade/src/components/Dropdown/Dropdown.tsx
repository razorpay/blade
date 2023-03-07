import React from 'react';
import { DropdownContext } from './useDropdown';
import type { DropdownContextType } from './useDropdown';
import { componentIds } from './dropdownUtils';
import { useId } from '~src/hooks/useId';
import type { WithComponentId } from '~utils';
import { isValidAllowedChildren } from '~utils';
import { getStyledProps } from '~components/Box/styled-props';
import type { StyledProps } from '~components/Box/styled-props';

import BaseBox from '~components/Box/BaseBox';

type DropdownProps = {
  selectionType?: 'single' | 'multiple';
  children: React.ReactNode[];
} & StyledProps;

/**
 * ### Dropdown component
 *
 * Dropdown component is generic component that controls the dropdown functionality.
 * It can be used with multiple triggers and mostly contains ActionList component inside it
 *
 * ---
 *
 * #### Usage
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
 *
 * ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-dropdown-with-select--with-single-select Dropdown Documentation}
 */
const Dropdown: WithComponentId<DropdownProps> = ({
  children,
  selectionType = 'single',
  ...styledProps
}): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState<DropdownContextType['options']>([]);
  const [selectedIndices, setSelectedIndices] = React.useState<
    DropdownContextType['selectedIndices']
  >([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [shouldIgnoreBlur, setShouldIgnoreBlur] = React.useState(false);
  const [shouldIgnoreBlurAnimation, setShouldIgnoreBlurAnimation] = React.useState(false);
  const triggererRef = React.useRef<HTMLButtonElement>(null);
  const actionListItemRef = React.useRef<HTMLDivElement>(null);
  const [hasFooterAction, setHasFooterAction] = React.useState(false);
  const [hasLabelOnLeft, setHasLabelOnLeft] = React.useState(false);
  const [isKeydownPressed, setIsKeydownPressed] = React.useState(false);

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
      shouldIgnoreBlurAnimation,
      setShouldIgnoreBlurAnimation,
      isKeydownPressed,
      setIsKeydownPressed,
      dropdownBaseId,
      triggererRef,
      actionListItemRef,
      selectionType,
      hasFooterAction,
      setHasFooterAction,
      hasLabelOnLeft,
      setHasLabelOnLeft,
      dropdownTriggerer,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isOpen,
      selectedIndices,
      options,
      activeIndex,
      shouldIgnoreBlur,
      shouldIgnoreBlurAnimation,
      selectionType,
      hasFooterAction,
      hasLabelOnLeft,
      isKeydownPressed,
    ],
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <BaseBox position="relative" {...getStyledProps(styledProps)}>
        {children}
      </BaseBox>
    </DropdownContext.Provider>
  );
};

Dropdown.componentId = componentIds.Dropdown;

export { Dropdown, DropdownProps };
