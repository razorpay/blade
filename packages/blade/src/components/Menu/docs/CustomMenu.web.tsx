import React from 'react';
import styled from 'styled-components';
import { MenuItem } from '../';
import { Box } from '~components/Box';
import {
  BusinessBankingIcon,
  CurrentAccountIcon,
  RazorpayXIcon,
  PaymentButtonIcon,
  PaymentGatewayIcon,
  PaymentLinksIcon,
  PaymentPagesIcon,
} from '~components/Icons';
import type { IconComponent } from '~components/Icons';
import { Text } from '~components/Typography';
import { makeBorderSize, makeSize, makeSpace } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

const CustomMenuTrigger = styled.button<{ isTransparent?: boolean }>((props) => {
  return {
    all: 'unset',
    padding: makeSpace(props.theme.spacing[4]),
    color: props.theme.colors.surface.text.gray.normal,
    backgroundColor: props.isTransparent
      ? props.theme.colors.transparent
      : props.theme.colors.interactive.background.gray.faded,
    borderRadius: props.isTransparent ? '0px' : makeSize(props.theme.border.radius.medium),
    borderBottomWidth: makeBorderSize(props.theme.border.width.thick),
    borderBottomStyle: 'solid',
    borderBottomColor: props.theme.colors.transparent,
    cursor: 'pointer',
    '&:hover, &[aria-expanded="true"]': {
      backgroundColor: props.isTransparent
        ? props.theme.colors.transparent
        : props.theme.colors.interactive.background.gray.fadedHighlighted,
      color: props.theme.colors.interactive.text.primary.normal,
      borderBottomColor: props.theme.colors.interactive.border.primary.default,
    },
    '&:focus-visible': getFocusRingStyles({ theme: props.theme }),
  };
});

const MenuTrigger = React.forwardRef<HTMLButtonElement, { children: string; className?: string }>(
  ({ children, ...props }, ref): React.ReactElement => {
    return (
      <CustomMenuTrigger ref={ref} {...props} isTransparent>
        <Text color="currentColor" weight="semibold">
          {children}
        </Text>
      </CustomMenuTrigger>
    );
  },
);

const navMenuItems = {
  payments: [
    {
      icon: PaymentGatewayIcon,
      name: 'Payment Gateway',
      description: 'Payments on your Website & App',
      href: '/payment-gateway',
    },
    {
      icon: PaymentLinksIcon,
      name: 'Payment Links',
      description: 'Payments Links for you',
      href: '/payment-links',
    },
    {
      icon: PaymentButtonIcon,
      name: 'Payment Button',
      description: 'Payments Buttons for your site',
      href: '/payment-button',
    },
    {
      icon: PaymentPagesIcon,
      name: 'Payment Pages',
      description: 'Payments Page for your Business',
      href: '/payment-pages',
    },
  ],
  banking: [
    {
      icon: RazorpayXIcon,
      name: 'RazorpayX',
      description: 'Business banking supercharged',
      href: '/x',
    },
    {
      icon: CurrentAccountIcon,
      name: 'Current Account',
      description: 'Payments Links for you',
      href: '/current-account',
    },
    {
      icon: BusinessBankingIcon,
      name: 'Razorpay Capital',
      description: 'Payments Buttons for your site',
      href: '/capital',
    },
  ],
};

const CustomMenuItem = ({
  icon: Icon,
  name,
  description,
  href,
}: {
  icon: IconComponent;
  name: string;
  description: string;
  href: string;
}): React.ReactElement => {
  return (
    <MenuItem href={href}>
      <Box display="flex" alignItems="center" gap="spacing.4">
        <Box display="flex" alignItems="center">
          <Box
            borderRadius="round"
            backgroundColor="surface.background.primary.intense"
            padding="spacing.3"
            height="36px"
            width="36px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon color="surface.icon.staticWhite.normal" />
          </Box>
        </Box>
        <Box>
          <Text weight="semibold" size="large">
            {name}
          </Text>
          <Text color="surface.text.gray.muted">{description}</Text>
        </Box>
      </Box>
    </MenuItem>
  );
};

export { MenuTrigger, navMenuItems, CustomMenuItem, CustomMenuTrigger };
