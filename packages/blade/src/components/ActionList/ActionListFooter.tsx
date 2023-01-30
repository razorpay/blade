/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import React from 'react';
import styled from 'styled-components';
import { componentIds } from './componentIds';
import { getActionListFooterRole } from './getA11yRoles';
import Box from '~components/Box';
import type { IconComponent } from '~components/Icons';
import { useDropdown } from '~components/Dropdown/useDropdown';
import type { WithComponentId } from '~utils';
import { isReactNative, makeSize, makeAccessible } from '~utils';
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
  } = useDropdown();

  React.useEffect(() => {
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
        setShouldIgnoreBlur(true);
      }}
      // @ts-ignore: Ignoring because the TS fails for React Native and works for web
      onKeyDown={(e) => {
        const nativeEvent = e.nativeEvent;
        // We ignore the selection keydowns on footer to let users click on items
        if ((nativeEvent.key === ' ' || nativeEvent.key === 'Enter') && activeIndex < 0) {
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
    >
      {props.leading ? <Box>{props.leading}</Box> : null}
      {props.title ? (
        <Box paddingLeft="spacing.3" paddingRight="spacing.3">
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

const ActionListFooterIcon = ({ icon }: { icon: IconComponent }): JSX.Element => {
  const Icon = icon;
  return <Icon color="surface.text.muted.lowContrast" size="small" />;
};

export { ActionListFooter, ActionListFooterIcon, ActionListFooterProps };
