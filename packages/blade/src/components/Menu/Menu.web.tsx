import {
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  useFloatingParentNodeId,
  useMergeRefs,
} from '@floating-ui/react';
import * as React from 'react';
import { MenuContext, useFloatingMenuSetup, useMenu } from './useMenu';
import type { MenuProps } from './types';

const MenuTree = ({
  children,
  openInteraction = 'click',
  onOpenChange,
  isOpen: isOpenControlled,
}: MenuProps): React.ReactElement => {
  const [hasFocusInside, setHasFocusInside] = React.useState(false);

  const elementsRef = React.useRef<(HTMLButtonElement | null)[]>([]);
  const labelsRef = React.useRef<(string | null)[]>([]);
  const parent = useMenu();

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
  } = useFloatingMenuSetup({
    elementsRef,
    openInteraction,
    onOpenChange,
    isOpen: isOpenControlled,
  });

  const referenceProps = {
    ref: useMergeRefs([refs.setReference, item.ref]),
    ...getReferenceProps(
      parent.getItemProps({
        onFocus() {
          setHasFocusInside(false);
          parent.setHasFocusInside(true);
        },
      }),
    ),
  };

  const floatingProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: refs.setFloating as any,
    style: floatingStyles,
    _transitionStyle: floatingTransitionStyles,
    ...getFloatingProps(),
  };

  const [menuTriggerChild, menuOverlayChild] = React.Children.toArray(children) as [
    React.ReactElement,
    React.ReactElement,
  ];

  const triggerWithReferenceProps = React.cloneElement(menuTriggerChild, {
    ...menuTriggerChild.props,
    ...referenceProps,
    _hasFocusInside: hasFocusInside,
    _isMenuTrigger: true,
  });

  const overlayWithFloatingProps = React.cloneElement(menuOverlayChild, {
    ...menuOverlayChild.props,
    ...floatingProps,
  });

  return (
    <FloatingNode id={nodeId}>
      <MenuContext.Provider
        value={{
          getItemProps,
          setHasFocusInside,
          isOpen,
        }}
      >
        {triggerWithReferenceProps}
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
          {isMounted && (
            <FloatingPortal>
              <FloatingFocusManager
                context={context}
                modal={false}
                initialFocus={-1}
                returnFocus={!isNested}
              >
                {overlayWithFloatingProps}
              </FloatingFocusManager>
            </FloatingPortal>
          )}
        </FloatingList>
      </MenuContext.Provider>
    </FloatingNode>
  );
};

const Menu = (props: MenuProps): React.ReactElement => {
  const parentId = useFloatingParentNodeId();

  if (parentId === null) {
    return (
      <FloatingTree>
        <MenuTree {...props} />
      </FloatingTree>
    );
  }

  return <MenuTree {...props} />;
};

export { Menu };
