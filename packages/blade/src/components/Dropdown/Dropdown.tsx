import React from 'react';
import { DropdownContext } from './useDropdown';
import type { DropdownContextType } from './useDropdown';
import type { DropdownProps } from './types';
import { dropdownComponentIds } from './dropdownComponentIds';
import { useId } from '~utils/useId';
import { ComponentIds as bottomSheetComponentIds } from '~components/BottomSheet/componentIds';
import { BottomSheetAndDropdownGlueContext } from '~components/BottomSheet/BottomSheetContext';
import { getStyledProps } from '~components/Box/styledProps';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { throwBladeError } from '~utils/logger';
import type { BladeElementRef, ContainerElementType } from '~utils/types';
import { useControllableState } from '~utils/useControllable';
import { mergeRefs } from '~utils/useMergeRefs';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const validDropdownChildren = [
  // TODO: Remove Box once CountrySelector's button sizing is fixed
  dropdownComponentIds.BaseBox,
  dropdownComponentIds.triggers.SelectInput,
  dropdownComponentIds.triggers.SearchInput,
  dropdownComponentIds.triggers.DropdownButton,
  dropdownComponentIds.triggers.DropdownLink,
  dropdownComponentIds.DropdownOverlay,
  dropdownComponentIds.triggers.AutoComplete,
  bottomSheetComponentIds.BottomSheet,
];

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
const _Dropdown = (
  {
    children,
    isOpen: isOpenControlled,
    onOpenChange,
    selectionType = 'single',
    testID,
    _width,
    ...rest
  }: DropdownProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const [options, setOptions] = React.useState<DropdownContextType['options']>([]);
  const [filteredValues, setFilteredValues] = React.useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = React.useState<
    DropdownContextType['selectedIndices']
  >([]);
  const [controlledValueIndices, setControlledValueIndices] = React.useState<
    DropdownContextType['selectedIndices']
  >([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [activeTagIndex, setActiveTagIndex] = React.useState(-1);
  const [shouldIgnoreBlurAnimation, setShouldIgnoreBlurAnimation] = React.useState(false);
  const [hasFooterAction, setHasFooterAction] = React.useState(false);
  const [
    hasAutoCompleteInBottomSheetHeader,
    setHasAutoCompleteInBottomSheetHeader,
  ] = React.useState(false);
  const [isKeydownPressed, setIsKeydownPressed] = React.useState(false);
  const [changeCallbackTriggerer, setChangeCallbackTriggerer] = React.useState<
    DropdownContextType['changeCallbackTriggerer']
  >(0);
  const [isControlled, setIsControlled] = React.useState(false);
  // keep track if dropdown contains bottomsheet
  const [dropdownHasBottomSheet, setDropdownHasBottomSheet] = React.useState(false);

  /**
   * In inputs, actual input is smaller than the visible input wrapper.
   * You can set this reference in such cases so floating ui calculations happen correctly
   * */
  const triggererWrapperRef = React.useRef<ContainerElementType>(null);
  const triggererRef = React.useRef<HTMLButtonElement>(null);
  const actionListItemRef = React.useRef<HTMLDivElement>(null);
  const dropdownTriggerer = React.useRef<DropdownContextType['dropdownTriggerer']>();
  const isTagDismissedRef = React.useRef<{ value: boolean } | null>({ value: false });
  const visibleTagsCountRef = React.useRef<{ value: number }>({ value: 0 });
  const dropdownContainerRef = React.useRef<HTMLDivElement>(null);

  const dropdownBaseId = useId('dropdown');
  const isDropdownOpenRef = React.useRef(isOpenControlled);

  const [isDropdownOpen, setIsDropdownOpen] = useControllableState({
    value: isOpenControlled,
    defaultValue: false,
    onChange: (isOpenControlledValue) => {
      isDropdownOpenRef.current = isOpenControlledValue;
      onOpenChange?.(isOpenControlledValue);
    },
  });

  isDropdownOpenRef.current = isDropdownOpen;

  const setIsOpen = (isOpenValue: boolean): void => {
    isDropdownOpenRef.current = isOpenValue;
    setIsDropdownOpen(() => isOpenValue);
  };

  const close = React.useCallback(() => {
    setActiveTagIndex(-1);
    setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (__DEV__) {
        if (!validDropdownChildren.includes(getComponentId(child) ?? '')) {
          throwBladeError({
            message: `Dropdown can only have one of following elements as children - \n\n ${validDropdownChildren.join(
              ', ',
            )} \n\n Check out: https://blade.razorpay.com/?path=/story/components-dropdown`,
            moduleName: 'Dropdown',
          });
        }
      }

      if (isValidAllowedChildren(child, dropdownComponentIds.triggers.SelectInput)) {
        dropdownTriggerer.current = 'SelectInput';
      }

      if (isValidAllowedChildren(child, dropdownComponentIds.triggers.SearchInput)) {
        dropdownTriggerer.current = 'SearchInput';
      }

      if (isValidAllowedChildren(child, dropdownComponentIds.triggers.DropdownButton)) {
        dropdownTriggerer.current = 'DropdownButton';
      }

      if (isValidAllowedChildren(child, dropdownComponentIds.triggers.AutoComplete)) {
        dropdownTriggerer.current = 'AutoComplete';
      }
    }
  });

  const contextValue = React.useMemo<DropdownContextType>(
    () => ({
      isOpen: isDropdownOpen,
      setIsOpen,
      close,
      selectedIndices,
      setSelectedIndices,
      controlledValueIndices,
      setControlledValueIndices,
      options,
      setOptions,
      filteredValues,
      setFilteredValues,
      activeIndex,
      setActiveIndex,
      activeTagIndex,
      setActiveTagIndex,
      visibleTagsCountRef,
      shouldIgnoreBlurAnimation,
      setShouldIgnoreBlurAnimation,
      isKeydownPressed,
      setIsKeydownPressed,
      dropdownBaseId,
      triggererRef,
      triggererWrapperRef,
      actionListItemRef,
      selectionType,
      hasFooterAction,
      setHasFooterAction,
      hasAutoCompleteInBottomSheetHeader,
      setHasAutoCompleteInBottomSheetHeader,
      dropdownTriggerer: dropdownTriggerer.current,
      changeCallbackTriggerer,
      setChangeCallbackTriggerer,
      isControlled,
      setIsControlled,
      isTagDismissedRef,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isDropdownOpen,
      isOpenControlled,
      selectedIndices,
      controlledValueIndices,
      options,
      filteredValues,
      activeIndex,
      activeTagIndex,
      shouldIgnoreBlurAnimation,
      selectionType,
      hasFooterAction,
      isKeydownPressed,
      changeCallbackTriggerer,
      isControlled,
    ],
  );

  const BottomSheetAndDropdownGlueContextValue = React.useMemo((): BottomSheetAndDropdownGlueContext => {
    return {
      isOpen: isDropdownOpen,
      dropdownHasBottomSheet,
      hasAutoCompleteInBottomSheetHeader,
      setDropdownHasBottomSheet,
      // This is the dismiss function which will be injected into the BottomSheet
      // Basically <BottomSheet onDismiss={onBottomSheetDismiss} />
      onBottomSheetDismiss: close,
    };
  }, [dropdownHasBottomSheet, hasAutoCompleteInBottomSheetHeader, isDropdownOpen, close]);

  return (
    <BottomSheetAndDropdownGlueContext.Provider value={BottomSheetAndDropdownGlueContextValue}>
      <DropdownContext.Provider value={contextValue}>
        <BaseBox
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={mergeRefs(ref, dropdownContainerRef as any)}
          {...metaAttribute({ name: MetaConstants.Dropdown, testID })}
          {...getStyledProps(rest)}
          {...makeAnalyticsAttribute(rest)}
          width={_width}
        >
          <BaseBox position="relative" textAlign={'left' as never}>
            {children}
          </BaseBox>
        </BaseBox>
      </DropdownContext.Provider>
    </BottomSheetAndDropdownGlueContext.Provider>
  );
};

const Dropdown = assignWithoutSideEffects(React.forwardRef(_Dropdown), {
  componentId: dropdownComponentIds.Dropdown,
});

export { Dropdown };
