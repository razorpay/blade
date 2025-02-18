import { FloatingFocusManager, FloatingList, FloatingPortal } from '@floating-ui/react';
import * as React from 'react';
import { DropdownContext, useFloatingDropdownSetup } from './useDropdown';
import type { DropdownProps } from './types';

const Dropdown = ({
  children,
  openInteraction = 'click',
  onOpenChange,
  isOpen: isOpenControlled,
}: DropdownProps): React.ReactElement => {
  const [hasFocusInside, setHasFocusInside] = React.useState(false);
  const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);

  const elementsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
  const labelsRef = React.useRef<(string | null)[]>([]);

  const {
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    refs,
    floatingStyles,
    isOpen,
    setIsOpen,
    isNested,
    context,
    isMounted,
    floatingTransitionStyles,
  } = useFloatingDropdownSetup({
    elementsRef,
    openInteraction,
    onOpenChange,
    isOpen: isOpenControlled,
  });

  const referenceProps = {
    ref: refs.setReference,
    ...getReferenceProps(),
  };

  const floatingProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: refs.setFloating as any,
    style: floatingStyles,
    _transitionStyle: floatingTransitionStyles,
    ...getFloatingProps(),
  };

  const [dropdownTriggerChild, dropdownOverlayChild] = React.Children.toArray(children) as [
    React.ReactElement,
    React.ReactElement,
  ];

  const triggerWithReferenceProps = React.cloneElement(dropdownTriggerChild, {
    ...dropdownTriggerChild.props,
    _referenceProps: referenceProps,
    _hasFocusInside: hasFocusInside,
    _isDropdownTrigger: true,
  });

  const overlayWithFloatingProps = React.cloneElement(dropdownOverlayChild, {
    ...dropdownOverlayChild.props,
    ...floatingProps,
  });

  const select = (index: number): void => {
    setSelectedIndices(() => [index]);
    setIsOpen(() => false);
  };

  const contextValue = React.useMemo(() => {
    return {
      getItemProps,
      setHasFocusInside,
      isOpen,
      select,
      selectedIndices,
      elementsRef,
    };
  }, [isOpen, selectedIndices]);

  return (
    <DropdownContext.Provider value={contextValue}>
      {triggerWithReferenceProps}
      <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
        {isMounted && (
          <FloatingPortal>
            <FloatingFocusManager
              context={context}
              modal={false}
              initialFocus={0}
              returnFocus={!isNested}
            >
              {overlayWithFloatingProps}
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </FloatingList>
    </DropdownContext.Provider>
  );
};

export { Dropdown };
