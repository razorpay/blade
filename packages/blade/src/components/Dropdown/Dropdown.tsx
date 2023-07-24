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

const validDropdownChildren = [
  componentIds.triggers.SelectInput,
  componentIds.triggers.DropdownButton,
  componentIds.triggers.DropdownLink,
  componentIds.DropdownOverlay,
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
  const [activeTagIndex, setActiveTagIndex] = React.useState(-1);
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
  const isFirstRenderRef = React.useRef(true);
  const isTagDismissedRef = React.useRef<{ value: boolean } | null>({ value: shouldIgnoreBlur });
  const dropdownContainerRef = React.useRef<HTMLDivElement>(null);

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
      if (!validDropdownChildren.includes(getComponentId(child) ?? '')) {
        throw new Error(
          `[Dropdown]: Dropdown can only have one of following elements as children - \n\n ${validDropdownChildren.join(
            ', ',
          )} \n\n Check out: https://blade.razorpay.com/?path=/story/components-dropdown`,
        );
      }

      if (isValidAllowedChildren(child, componentIds.triggers.SelectInput)) {
        dropdownTriggerer.current = 'SelectInput';
      }

      if (isValidAllowedChildren(child, componentIds.triggers.DropdownButton)) {
        dropdownTriggerer.current = 'DropdownButton';
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
      activeIndex,
      setActiveIndex,
      activeTagIndex,
      setActiveTagIndex,
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
      isTagDismissedRef,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isOpen,
      selectedIndices,
      controlledValueIndices,
      options,
      activeIndex,
      activeTagIndex,
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

        if (!dropdown) {
          return;
        }

        if (target === null) {
          close();
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
          position="relative"
          textAlign={'left' as never}
          {...getStyledProps(styledProps)}
        >
          {children}
        </BaseBox>
      </DropdownContext.Provider>
    </BottomSheetAndDropdownGlueContext.Provider>
  );
};

const Dropdown = assignWithoutSideEffects(_Dropdown, { componentId: componentIds.Dropdown });

export { Dropdown };
