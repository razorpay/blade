/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
import type { ButtonProps } from '../Button';
import { Button } from '../Button';
import { Divider } from './Divider';
import { useVerifyInsideCard, useVerifyAllowedComponents } from './CardContext';
import { ComponentIds } from './Card';
import Box from '~components/Box';
import { Text } from '~components/Typography';
import type { WithComponentId } from '~utils';
import { metaAttribute, MetaConstants, useBreakpoint } from '~utils';

import { useTheme } from '~components/BladeProvider';

export type CardFooterAction = Pick<
  ButtonProps,
  'type' | 'accessibilityLabel' | 'isLoading' | 'isDisabled' | 'icon' | 'iconPosition' | 'onClick'
> & {
  text: ButtonProps['children'];
};

type CardFooterProps = {
  children?: React.ReactNode;
};

const useIsMobile = (): boolean => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  return matchedDeviceType === 'mobile';
};

const CardFooter: WithComponentId<CardFooterProps> = ({ children }) => {
  const isMobile = useIsMobile();
  useVerifyInsideCard('CardFooter');
  useVerifyAllowedComponents(children, 'CardFooter', [
    ComponentIds.CardFooterLeading,
    ComponentIds.CardFooterTrailing,
  ]);

  return (
    <Box marginTop="auto" {...metaAttribute(MetaConstants.Component, MetaConstants.CardFooter)}>
      <Box marginTop="spacing.7" />
      <Divider />
      <Box
        marginTop="spacing.7"
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isMobile ? 'stretch' : 'center'}
      >
        {children}
      </Box>
    </Box>
  );
};
CardFooter.componentId = ComponentIds.CardFooter;

type CardFooterLeadingProps = {
  title?: string;
  subtitle?: string;
};
const CardFooterLeading: WithComponentId<CardFooterLeadingProps> = ({ title, subtitle }) => {
  useVerifyInsideCard('CardFooterLeading');

  return (
    <Box>
      {title && (
        <Text variant="body" size="medium" weight="bold">
          {title}
        </Text>
      )}
      {subtitle && (
        <Text variant="body" size="small" weight="regular">
          {subtitle}
        </Text>
      )}
    </Box>
  );
};
CardFooterLeading.componentId = ComponentIds.CardFooterLeading;

type CardFooterTrailingProps = {
  actions?: {
    primary?: CardFooterAction;
    secondary?: CardFooterAction;
  };
};
const CardFooterTrailing: WithComponentId<CardFooterTrailingProps> = ({ actions }) => {
  const isMobile = useIsMobile();
  useVerifyInsideCard('CardFooterTrailing');

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignSelf={isMobile ? 'auto' : 'center'}
      marginTop={isMobile ? 'spacing.5' : 'spacing.0'}
      marginLeft={isMobile ? 'spacing.0' : 'spacing.5'}
    >
      <Box flexGrow={1}>
        {actions?.secondary ? (
          <Button isFullWidth size="medium" variant="secondary" {...actions.secondary}>
            {actions.secondary.text!}
          </Button>
        ) : null}
      </Box>
      <Box marginLeft="spacing.5" />
      <Box flexGrow={1}>
        {actions?.primary ? (
          <Button isFullWidth size="medium" {...actions.primary}>
            {actions.primary.text!}
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};
CardFooterTrailing.componentId = ComponentIds.CardFooterTrailing;

export { CardFooter, CardFooterLeading, CardFooterTrailing };
