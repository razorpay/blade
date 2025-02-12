import {
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  useMergeRefs,
} from '@floating-ui/react';
import * as React from 'react';
import { DropdownContext, useFloatingDropdownSetup, useDropdown } from './useDropdown';
import type { DropdownProps } from './types';

const Dropdown = ({
  children,
  openInteraction = 'click',
  onOpenChange,
  isOpen: isOpenControlled,
}: DropdownProps): React.ReactElement => {
  const [hasFocusInside, setHasFocusInside] = React.useState(false);
  // const [selectedIndices, setSelectedIndices] = React.useState<number[]>([]);

  const elementsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
  const labelsRef = React.useRef<(string | null)[]>([]);
  const parent = useDropdown();

  const {
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    item,
    refs,
    floatingStyles,
    isOpen,
    nodeId,
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

  const mergedRefs = useMergeRefs([refs.setReference, item.ref]);

  const referenceProps = React.useMemo(() => {
    return {
      ref: mergedRefs,
      ...getReferenceProps(
        parent.getItemProps({
          onFocus() {
            setHasFocusInside(false);
            parent.setHasFocusInside(true);
          },
        }),
      ),
    };
  }, []);

  // const floatingProps = React.useMemo(() => {
  //   return {
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     ref: refs.setFloating as any,
  //     style: floatingStyles,
  //     _transitionStyle: floatingTransitionStyles,
  //     ...getFloatingProps(),
  //   };
  // }, [floatingStyles, floatingTransitionStyles]);
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

  // const select = (index: number): void => {
  //   setSelectedIndices(() => [index]);
  // };

  const contextValue = React.useMemo(() => {
    return {
      getItemProps,
      setHasFocusInside,
      isOpen,
    };
  }, [isOpen]);

  return (
    <FloatingNode id={nodeId}>
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
    </FloatingNode>
  );
};

export { Dropdown };
