/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import type { SideNavLinkProps } from '../types';
import { SideNav, SideNavBody, SideNavLevel, SideNavLink, SideNavVisibility } from '../index';
import { Box } from '~components/Box';
import iconMap from '~components/Icons/iconMap';
import {
  HomeIcon,
  InvoicesIcon,
  MagicCheckoutIcon,
  PaymentLinkIcon,
  PinIcon,
  PlusIcon,
  RoutesIcon,
} from '~components/Icons';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Tooltip } from '~components/Tooltip';
import { Link } from '~components/Link';

const titleSuffixMapping = {
  '<Badge color="positive" size="small">NEW</Badge>': (
    <Badge color="positive" size="small">
      NEW
    </Badge>
  ),
};

const trailingMapping = {
  '<Button icon={PlusIcon} variant="tertiary" size="xsmall" />': (
    <Button icon={PlusIcon} variant="tertiary" size="xsmall" />
  ),
};

export default {
  title: 'Components/SideNav/SideNavLink Playground',
  component: SideNavLink,

  argTypes: {
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
    } as unknown,
    titleSuffix: {
      name: 'titleSuffix',
      type: 'select',
      options: Object.keys(titleSuffixMapping),
      mapping: titleSuffixMapping,
    } as unknown,
    trailing: {
      name: 'trailing',
      type: 'select',
      options: Object.keys(trailingMapping),
      mapping: trailingMapping,
    } as unknown,
    trailingVisibility: {
      name: 'trailingVisibility',
      type: 'select',
      options: ['hover', 'always'],
    } as unknown,
  },
} as Meta<SideNavLinkProps>;

const SideNavLinkTemplate: StoryFn<typeof SideNavLink> = (args) => {
  return (
    <Box>
      <SideNav position="absolute" top="spacing.0">
        <SideNavBody>
          <SideNavLink {...args} />
        </SideNavBody>
      </SideNav>
    </Box>
  );
};

export const SideNavLinkPlayground = SideNavLinkTemplate.bind({});
SideNavLinkPlayground.args = {
  title: 'Home',
  icon: HomeIcon,
  tooltip: { content: 'Open Dashboard Home (Cmd + H)' },
};
SideNavLinkPlayground.storyName = 'SideNavLink Playground';

// Stories render outside a router, so a plain anchor stands in for the router's Link
const StoryLink = ({
  to,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }): React.ReactElement => (
  <a {...props} href={to}>
    {children}
  </a>
);

const PinAction = ({ title, isPinned }: { title: string; isPinned?: boolean }) => (
  <Tooltip content={isPinned ? 'Unpin' : 'Pin to top'} placement="right">
    <IconButton
      icon={PinIcon}
      accessibilityLabel={isPinned ? `Unpin ${title}` : `Pin ${title} to top`}
      onClick={() => console.log(isPinned ? 'unpin' : 'pin', title)}
    />
  </Tooltip>
);

// First three items keep trailing always visible (e.g. pinned items that can be unpinned).
// Last two show it on hover or keyboard focus of the item, which is the default.
export const TrailingVisibility: StoryFn<typeof SideNavLink> = () => {
  return (
    <Box>
      <SideNav position="absolute" top="spacing.0">
        <SideNavBody>
          <SideNavLink
            as={StoryLink}
            href="/payment-links"
            icon={PaymentLinkIcon}
            title="Payment Links"
            trailingVisibility="always"
            trailing={<PinAction title="Payment Links" isPinned />}
          />
          <SideNavLink
            as={StoryLink}
            href="/magic-checkout"
            icon={MagicCheckoutIcon}
            title="Magic Checkout"
            trailingVisibility="always"
            trailing={<PinAction title="Magic Checkout" isPinned />}
          >
            <SideNavLevel>
              <SideNavLink as={StoryLink} href="/magic-checkout/home" title="Home" />
            </SideNavLevel>
          </SideNavLink>
          <SideNavLink
            as={StoryLink}
            href="/international"
            icon={HomeIcon}
            title="International Payments and Settlements"
            trailingVisibility="always"
            trailing={<PinAction title="the long item" isPinned />}
          />
          <SideNavLink
            as={StoryLink}
            href="/invoices"
            icon={InvoicesIcon}
            title="Invoices"
            trailing={<PinAction title="Invoices" />}
          />
          <SideNavLink
            as={StoryLink}
            href="/route"
            icon={RoutesIcon}
            title="Route"
            trailing={<PinAction title="Route" />}
          >
            <SideNavLevel>
              <SideNavLink as={StoryLink} href="/route/transfers" title="Transfers" />
            </SideNavLevel>
          </SideNavLink>
        </SideNavBody>
      </SideNav>
    </Box>
  );
};
TrailingVisibility.storyName = 'Trailing Visibility';

export const CollapsedVisibility: StoryFn<typeof SideNav> = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <Box>
      <SideNav position="absolute" top="spacing.0" isExpanded={isExpanded}>
        <SideNavBody>
          <SideNavLink as={StoryLink} href="/home" icon={HomeIcon} title="Home" />
          <SideNavLink as={StoryLink} href="/invoices" icon={InvoicesIcon} title="Invoices" />
          <SideNavVisibility visibleWhen="expanded">
            <Box paddingX="spacing.4" paddingY="spacing.2">
              <Link variant="button" size="small" color="neutral">
                +3 More
              </Link>
            </Box>
          </SideNavVisibility>
          <SideNavVisibility visibleWhen="collapsed">
            <Box paddingX="spacing.4" paddingY="spacing.2">
              <Link variant="button" size="small" color="neutral">
                +3
              </Link>
            </Box>
          </SideNavVisibility>
        </SideNavBody>
      </SideNav>
      <Box marginLeft="300px" padding="spacing.6">
        <Button size="small" variant="secondary" onClick={() => setIsExpanded((prev) => !prev)}>
          {isExpanded ? 'Collapse SideNav' : 'Expand SideNav'}
        </Button>
      </Box>
    </Box>
  );
};
CollapsedVisibility.storyName = 'SideNavVisibility';
