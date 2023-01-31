/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from 'react';
import styled from 'styled-components';
import { componentIds } from './componentIds';
import { getActionListFooterRole } from './getA11yRoles';
import Box from '~components/Box';
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

type ActionListFooterProps = {
  title?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

const StyledActionListFooter = styled(Box)((props) => {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${makeSize(props.theme.spacing[3])} ${makeSize(props.theme.spacing[5])}`,
    backgroundColor: props.theme.colors.brand.gray.a50.lowContrast,
    margin: `${makeSize(props.theme.spacing[3])} -${makeSize(props.theme.spacing[3])} -${makeSize(
      props.theme.spacing[3],
    )}`,
  };
});

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
          if (selectionType === 'single') {
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
        if (nextItemRole !== 'combobox' && nextItemRole !== 'option') {
          setIsOpen(false);
        }
      }}
      {...makeAccessible({
        role: getActionListFooterRole(),
        label: props.title,
      })}
      {...metaAttribute(MetaConstants.Component, MetaConstants.ActionListFooter)}
    >
      {props.leading ? <Box>{props.leading}</Box> : null}
      {props.title ? (
        <Box flex="1" paddingLeft="spacing.3" paddingRight="spacing.3">
          <Text variant="caption" color="surface.text.subdued.lowContrast">
            {props.title}
          </Text>
        </Box>
      ) : null}
      {props.trailing ? (
        <Box
          display="flex"
          alignItems="center"
          marginLeft={isOnlyActionButton ? undefined : 'auto'}
          width={isOnlyActionButton ? '100%' : undefined}
        >
          {props.trailing}
        </Box>
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
