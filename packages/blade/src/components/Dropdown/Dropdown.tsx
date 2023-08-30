import React from 'react';
import { DropdownContext } from './useDropdown';
import type { DropdownContextType } from './useDropdown';
import { componentIds } from './dropdownUtils';
import type { DropdownProps } from './types';
import { useId } from '~utils/useId';
import { ComponentIds as bottomSheetComponentIds } from '~components/BottomSheet/componentIds';
import { BottomSheetAndDropdownGlueContext } from '~components/BottomSheet/BottomSheetContext';
import { getStyledProps } from '~components/Box/styledProps';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { isReactNative } from '~utils';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { throwBladeError } from '~utils/logger';
import type { ContainerElementType } from '~utils/types';

const validDropdownChildren = [
  componentIds.triggers.SelectInput,
  componentIds.triggers.DropdownButton,
  componentIds.triggers.DropdownLink,
  componentIds.DropdownOverlay,
  componentIds.triggers.AutoComplete,
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
const _Dropdown = ({
  children,
  selectionType = 'single',
  onDismiss,
  testID,
  ...styledProps
}: DropdownProps): React.ReactElement => {
  const [isOpen, setIsOpen] = React.useState(false);
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
  const [hasLabelOnLeft, setHasLabelOnLeft] = React.useState(false);
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
  const isFirstRenderRef = React.useRef(true);
  const isTagDismissedRef = React.useRef<{ value: boolean } | null>({ value: false });
  const visibleTagsCountRef = React.useRef<{ value: number }>({ value: 0 });
  const dropdownContainerRef = React.useRef<HTMLDivElement>(null);

  const dropdownBaseId = useId('dropdown');

  React.useEffect(() => {
    // Ignoring the `onDismiss` call on first render
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    if (!isOpen && onDismiss) {
      onDismiss();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const close = React.useCallback(() => {
    setActiveTagIndex(-1);
    setIsOpen(false);
    onDismiss?.();
  }, [onDismiss]);

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

      if (isValidAllowedChildren(child, componentIds.triggers.SelectInput)) {
        dropdownTriggerer.current = 'SelectInput';
      }

      if (isValidAllowedChildren(child, componentIds.triggers.DropdownButton)) {
        dropdownTriggerer.current = 'DropdownButton';
      }

      if (isValidAllowedChildren(child, componentIds.triggers.AutoComplete)) {
        dropdownTriggerer.current = 'AutoComplete';
      }
    }
  });

  const contextValue = React.useMemo<DropdownContextType>(
    () => ({
      isOpen,
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
      hasLabelOnLeft,
      setHasLabelOnLeft,
      dropdownTriggerer: dropdownTriggerer.current,
      changeCallbackTriggerer,
      setChangeCallbackTriggerer,
      isControlled,
      setIsControlled,
      isTagDismissedRef,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isOpen,
      selectedIndices,
      controlledValueIndices,
      options,
      filteredValues,
      activeIndex,
      activeTagIndex,
      shouldIgnoreBlurAnimation,
      selectionType,
      hasFooterAction,
      hasLabelOnLeft,
      isKeydownPressed,
      changeCallbackTriggerer,
      isControlled,
    ],
  );

  const BottomSheetAndDropdownGlueContextValue = React.useMemo((): BottomSheetAndDropdownGlueContext => {
    return {
      isOpen,
      dropdownHasBottomSheet,
      setDropdownHasBottomSheet,
      // This is the dismiss function which will be injected into the BottomSheet
      // Basically <BottomSheet onDismiss={onBottomSheetDismiss} />
      onBottomSheetDismiss: close,
    };
  }, [dropdownHasBottomSheet, isOpen, close]);

  React.useEffect((): (() => void) | undefined => {
    if (!isReactNative()) {
      const dropdown = dropdownContainerRef.current;

      const documentClickHandler = (e: MouseEvent): void => {
        const target = e.target as HTMLDivElement;

        if (!target || !dropdown) {
          return;
        }

        if (!dropdown.contains(target) && !isTagDismissedRef.current?.value) {
          close();
        }

        if (isTagDismissedRef.current?.value) {
          isTagDismissedRef.current.value = false;
        }
      };

      const documentFocusHandler = (e: FocusEvent): void => {
        const target = e.relatedTarget as HTMLDivElement;
        setActiveIndex(-1);

        if (!dropdown || !target) {
          return;
        }

        if (!dropdown.contains(target)) {
          close();
        }
      };

      document.addEventListener('click', documentClickHandler);
      document.addEventListener('focusout', documentFocusHandler);

      return (): void => {
        document.removeEventListener('click', documentClickHandler);
        document.removeEventListener('focusout', documentFocusHandler);
      };
    }

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BottomSheetAndDropdownGlueContext.Provider value={BottomSheetAndDropdownGlueContextValue}>
      <DropdownContext.Provider value={contextValue}>
        <BaseBox
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={dropdownContainerRef as any}
          {...metaAttribute({ name: MetaConstants.Dropdown, testID })}
          {...getStyledProps(styledProps)}
        >
          <BaseBox position="relative" textAlign={'left' as never}>
            {children}
          </BaseBox>
        </BaseBox>
      </DropdownContext.Provider>
    </BottomSheetAndDropdownGlueContext.Provider>
  );
};

const Dropdown = assignWithoutSideEffects(_Dropdown, { componentId: componentIds.Dropdown });

export { Dropdown };
