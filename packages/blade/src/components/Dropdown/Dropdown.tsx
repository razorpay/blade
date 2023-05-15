import React from 'react';
import { DropdownContext } from './useDropdown';
import type { DropdownContextType } from './useDropdown';
import { componentIds } from './dropdownUtils';
import { useId } from '~src/hooks/useId';
import { isValidAllowedChildren } from '~utils';
import { ComponentIds as bottomSheetComponentIds } from '~components/BottomSheet/componentIds';
import { BottomSheetAndDropdownGlueContext } from '~components/BottomSheet/BottomSheetContext';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';

import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

type DropdownProps = {
  selectionType?: 'single' | 'multiple';
  children: React.ReactNode[];
} & StyledPropsBlade;

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
const _Dropdown = ({
  children,
  selectionType = 'single',
  ...styledProps
}: DropdownProps): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [options, setOptions] = React.useState<DropdownContextType['options']>([]);
  const [selectedIndices, setSelectedIndices] = React.useState<
    DropdownContextType['selectedIndices']
  >([]);
  const [controlledValueIndices, setControlledValueIndices] = React.useState<
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
  const [changeCallbackTriggerer, setChangeCallbackTriggerer] = React.useState<
    DropdownContextType['changeCallbackTriggerer']
  >(0);
  const [isControlled, setIsControlled] = React.useState(false);
  // keep track if dropdown contains bottomsheet
  const [dropdownHasBottomSheet, setDropdownHasBottomSheet] = React.useState(false);

  const dropdownBaseId = useId('dropdown');

  const dropdownTriggerer = React.useRef<DropdownContextType['dropdownTriggerer']>();

  React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (
        !isValidAllowedChildren(child, 'SelectInput') &&
        !isValidAllowedChildren(child, 'DropdownButton') &&
        !isValidAllowedChildren(child, componentIds.DropdownOverlay) &&
        !isValidAllowedChildren(child, bottomSheetComponentIds.BottomSheet)
      ) {
        throw new Error(
          `[Dropdown]: Dropdown can only have \`SelectInput\` and \`DropdownOverlay\` as children\n\n Check out: https://blade.razorpay.com/?path=/story/components-dropdown`,
        );
      }

      if (isValidAllowedChildren(child, 'SelectInput')) {
        dropdownTriggerer.current = 'SelectInput';
      }

      if (isValidAllowedChildren(child, 'DropdownButton')) {
        dropdownTriggerer.current = 'DropdownButton';
      }
    }
  });

  const contextValue = React.useMemo<DropdownContextType>(
    () => ({
      isOpen,
      setIsOpen,
      selectedIndices,
      setSelectedIndices,
      controlledValueIndices,
      setControlledValueIndices,
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
      dropdownTriggerer: dropdownTriggerer.current,
      changeCallbackTriggerer,
      setChangeCallbackTriggerer,
      isControlled,
      setIsControlled,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isOpen,
      selectedIndices,
      controlledValueIndices,
      options,
      activeIndex,
      shouldIgnoreBlur,
      shouldIgnoreBlurAnimation,
      selectionType,
      hasFooterAction,
      hasLabelOnLeft,
      isKeydownPressed,
      changeCallbackTriggerer,
      isControlled,
    ],
  );

  const BottomSheetAndDropdownGlueContextValue = React.useMemo(() => {
    return {
      isOpen,
      setIsOpen,
      selectionType,
      dropdownHasBottomSheet,
      setDropdownHasBottomSheet,
    };
  }, [isOpen, setIsOpen, selectionType, dropdownHasBottomSheet, setDropdownHasBottomSheet]);

  return (
    <BottomSheetAndDropdownGlueContext.Provider value={BottomSheetAndDropdownGlueContextValue}>
      <DropdownContext.Provider value={contextValue}>
        <BaseBox position="relative" {...getStyledProps(styledProps)}>
          {children}
        </BaseBox>
      </DropdownContext.Provider>
    </BottomSheetAndDropdownGlueContext.Provider>
  );
};

const Dropdown = assignWithoutSideEffects(_Dropdown, { componentId: componentIds.Dropdown });

export { Dropdown, DropdownProps };
