/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from 'react';
import styled from 'styled-components';
import { componentIds } from './componentIds';
import { getActionListFooterRole } from './getA11yRoles';
import BaseBox from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import { useDropdown } from '~components/Dropdown/useDropdown';
import {
  isReactNative,
  makeSize,
  makeAccessible,
  MetaConstants,
  metaAttribute,
  isValidAllowedChildren,
} from '~utils';
import type { WithComponentId } from '~utils';
import { Text } from '~components/Typography';
import { useDropdownBottomSheetContext } from '~components/BottomSheet/BottomSheetContext';

type ActionListFooterProps = {
  title?: string;
  /**
   * Asset to be added on left side of Footer.
   *
   * Valid children - `ActionListFooterIcon`
   */
  leading?: React.ReactNode;
  /**
   * Elements to be added on right side of Footer.
   *
   * Anything can be passed here but maybe don't? Should ideally have Button or Tick Icon Buttons.
   */
  trailing?: React.ReactNode;
};

const StyledActionListFooter = styled(BaseBox)((props) => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${makeSize(props.theme.spacing[3])} ${makeSize(props.theme.spacing[5])}`,
    backgroundColor: props.theme.colors.brand.gray.a50.lowContrast,
  };
});

/**
 * ### ActionListFooter
 *
 * To be used inside `ActionList`
 *
 * #### Usage
 *
 * ```jsx
 * <ActionListFooter
 *  title="Search Tips"
 *  leading={<ActionListFooterIcon icon={SearchIcon} />}
 *  trailing={
 *    <Button
 *      onClick={() => { console.log('click') }}
 *    >
 *      Apply
 *    </Button>
 *  }
 * />
 * ```
 */
const ActionListFooter: WithComponentId<ActionListFooterProps> = (props): JSX.Element => {
  const footerRef = React.useRef<HTMLDivElement | null>(null);
  const {
    setShouldIgnoreBlur,
    setHasFooterAction,
    onTriggerKeydown,
    activeIndex,
    setIsOpen,
    selectionType,
  } = useDropdown();
  const bottomSheetContext = useDropdownBottomSheetContext();

  React.useEffect(() => {
    React.Children.map(props.leading, (child) => {
      if (!isValidAllowedChildren(child, componentIds.ActionListFooterIcon)) {
        throw new Error(
          `[ActionListFooter]: Only ${componentIds.ActionListFooterIcon} is allowed in leading prop`,
        );
      }
    });
  }, [props.leading]);

  React.useEffect(() => {
    // We only need this in web to handle some keydown events
    if (!isReactNative() && footerRef.current?.querySelector('button, a')) {
      setHasFooterAction(true);
    }
  }, [setHasFooterAction, props.trailing]);

  const isOnlyActionButton = !props.title && !props.leading && props.trailing;

  return (
    <StyledActionListFooter
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={footerRef as any}
      // @ts-ignore: Ignoring because the TS fails for React Native and works for web
      onMouseDown={() => {
        if (selectionType === 'multiple') {
          setShouldIgnoreBlur(true);
        }
      }}
      // @ts-ignore: Ignoring because the TS fails for React Native and works for web
      onKeyDown={(e) => {
        const nativeEvent = e.nativeEvent;
        const shouldIgnoreDropdownKeydown =
          (nativeEvent.key === ' ' || nativeEvent.key === 'Enter') && activeIndex < 0;
        // We ignore the selection keydowns on footer to let users click on items on the footer
        if (shouldIgnoreDropdownKeydown) {
          if (selectionType === 'single' && !bottomSheetContext?.hasBottomSheet) {
            // We close the dropdown on clicks in single select
            setIsOpen(false);
          }
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onTriggerKeydown?.({ event: e.nativeEvent } as any);
      }}
      // @ts-ignore: Ignoring because the TS fails for React Native and works for web
      onBlur={(e) => {
        const nextItem = e.relatedTarget;
        const nextItemRole = nextItem?.getAttribute('role');
        if (
          nextItemRole !== 'combobox' &&
          nextItemRole !== 'option' &&
          !bottomSheetContext?.hasBottomSheet
        ) {
          setIsOpen(false);
        }
      }}
      {...makeAccessible({
        role: getActionListFooterRole(),
        label: props.title,
      })}
      {...metaAttribute(MetaConstants.Component, MetaConstants.ActionListFooter)}
    >
      {props.leading ? <BaseBox>{props.leading}</BaseBox> : null}
      {props.title ? (
        <BaseBox flex={1} paddingLeft="spacing.3" paddingRight="spacing.3">
          <Text variant="caption" color="surface.text.subdued.lowContrast">
            {props.title}
          </Text>
        </BaseBox>
      ) : null}
      {props.trailing ? (
        <BaseBox
          display="flex"
          alignItems="center"
          marginLeft={isOnlyActionButton ? undefined : 'auto'}
          width={isOnlyActionButton ? '100%' : undefined}
        >
          {props.trailing}
        </BaseBox>
      ) : null}
    </StyledActionListFooter>
  );
};

ActionListFooter.componentId = componentIds.ActionListFooter;

const ActionListFooterIcon: WithComponentId<{ icon: IconComponent }> = ({ icon }) => {
  const Icon = icon;
  return <Icon color="surface.text.muted.lowContrast" size="small" />;
};

ActionListFooterIcon.componentId = componentIds.ActionListFooterIcon;

export { ActionListFooter, ActionListFooterIcon, ActionListFooterProps };
