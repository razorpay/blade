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
  PaymentPagesIcon,
  PinIcon,
  PlusIcon,
  QRCodeIcon,
  RoutesIcon,
  SubscriptionsIcon,
} from '~components/Icons';
import type { IconComponent } from '~components/Icons';
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
// SideNavLink passes a ref to the link, so this forwards it to the anchor like a router's Link does
const StoryLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string }
>(function StoryLink({ to, children, onClick, ...props }, ref) {
  return (
    <a
      {...props}
      ref={ref}
      href={to}
      onClick={(e) => {
        // keep the story in place instead of navigating to the href
        e.preventDefault();
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
});

// The "current page" of a story, kept in state. Clicking an item makes it active,
// and an item with a next level opens it, like it would with a router
const ActivePathContext = React.createContext<{
  activePath: string;
  setActivePath: (path: string) => void;
}>({ activePath: '', setActivePath: () => undefined });

const StoryNav = ({
  initialPath,
  children,
}: {
  initialPath: string;
  children: React.ReactNode;
}): React.ReactElement => {
  const [activePath, setActivePath] = React.useState(initialPath);

  return (
    <ActivePathContext.Provider value={{ activePath, setActivePath }}>
      {children}
    </ActivePathContext.Provider>
  );
};

const StoryNavLink = ({
  activeOnPrefix,
  ...props
}: Omit<SideNavLinkProps, 'as' | 'isActive'> & {
  /**
   * Item is also active on every path that starts with this. Used on items that open the next level
   */
  activeOnPrefix?: string;
}): React.ReactElement => {
  const { activePath, setActivePath } = React.useContext(ActivePathContext);
  const href = props.href ?? '';
  const isActive =
    activePath === href || Boolean(activeOnPrefix && activePath.startsWith(activeOnPrefix));

  return (
    <SideNavLink
      {...props}
      as={StoryLink}
      isActive={isActive}
      onClick={(event) => {
        setActivePath(href);
        props.onClick?.(event);
      }}
    />
  );
};

const PinAction = ({
  title,
  isPinned,
  onClick,
}: {
  title: string;
  isPinned: boolean;
  onClick: (event: React.SyntheticEvent) => void;
}) => (
  <Tooltip content={isPinned ? 'Unpin' : 'Pin to top'} placement="right">
    <IconButton
      icon={PinIcon}
      accessibilityLabel={isPinned ? `Unpin ${title}` : `Pin ${title} to top`}
      onClick={onClick}
    />
  </Tooltip>
);

type PinnableItem = {
  id: string;
  title: string;
  icon: IconComponent;
  /**
   * Titles of the items in the next level. The item opens the next level when this is set
   */
  nextLevelItems?: string[];
};

const toPath = (...parts: string[]): string =>
  `/${parts.map((part) => part.toLowerCase().replace(/\s+/g, '-')).join('/')}`;

/**
 * A SideNav whose items can be pinned.
 *
 * - Pin an item and it moves to the top, with its pin always visible (`trailingVisibility="always"`).
 * - Unpin it and it goes back to its original place, with its pin back to showing on hover.
 * - Clicking an item makes it active. An item with a next level opens it.
 */
const PinnableNav = ({
  items,
  initialPinnedIds = [],
}: {
  items: PinnableItem[];
  initialPinnedIds?: string[];
}): React.ReactElement => {
  const [pinnedIds, setPinnedIds] = React.useState<string[]>(initialPinnedIds);
  // After unpinning with the pointer, the pin stays away until the pointer leaves that item.
  // Without this, an item that does not move on unpin would show the pin again at once since it is still hovered
  const [quietId, setQuietId] = React.useState<string>();

  const togglePin = (id: string, event: React.SyntheticEvent): void => {
    const isPinned = pinnedIds.includes(id);
    const isPointerClick = (event.nativeEvent as MouseEvent).detail > 0;
    setPinnedIds(isPinned ? pinnedIds.filter((pinnedId) => pinnedId !== id) : [...pinnedIds, id]);
    setQuietId(isPinned && isPointerClick ? id : undefined);
  };

  const orderedItems = [
    ...pinnedIds.flatMap((id) => items.filter((item) => item.id === id)),
    ...items.filter((item) => !pinnedIds.includes(item.id)),
  ];

  return (
    <StoryNav initialPath={toPath(items[0].id)}>
      <SideNav position="absolute" top="spacing.0">
        <SideNavBody>
          {orderedItems.map((item) => {
            const isPinned = pinnedIds.includes(item.id);
            const { nextLevelItems } = item;

            return (
              <Box
                key={item.id}
                onMouseLeave={() => setQuietId((prev) => (prev === item.id ? undefined : prev))}
              >
                <StoryNavLink
                  href={nextLevelItems ? toPath(item.id, nextLevelItems[0]) : toPath(item.id)}
                  activeOnPrefix={nextLevelItems ? toPath(item.id) : undefined}
                  icon={item.icon}
                  title={item.title}
                  trailingVisibility={isPinned ? 'always' : 'hover'}
                  trailing={
                    // Hidden instead of removed while quiet, so the item keeps the same room for it
                    // and a long title does not change where it truncates
                    <Box visibility={quietId === item.id ? 'hidden' : undefined}>
                      <PinAction
                        title={item.title}
                        isPinned={isPinned}
                        onClick={(event) => togglePin(item.id, event)}
                      />
                    </Box>
                  }
                >
                  {nextLevelItems ? (
                    <SideNavLevel>
                      {nextLevelItems.map((title) => (
                        <StoryNavLink key={title} href={toPath(item.id, title)} title={title} />
                      ))}
                    </SideNavLevel>
                  ) : undefined}
                </StoryNavLink>
              </Box>
            );
          })}
        </SideNavBody>
      </SideNav>
    </StoryNav>
  );
};

// Starts with three pinned items: a plain one, one that opens the next level, and one with a long title
// that truncates before its pin. The other two show their pin on hover or keyboard focus, which is the default.
export const TrailingVisibility: StoryFn<typeof SideNavLink> = () => {
  return (
    <PinnableNav
      initialPinnedIds={['payment-links', 'magic-checkout', 'international-payments']}
      items={[
        { id: 'payment-links', title: 'Payment Links', icon: PaymentLinkIcon },
        {
          id: 'magic-checkout',
          title: 'Magic Checkout',
          icon: MagicCheckoutIcon,
          nextLevelItems: ['Home', 'Orders', 'Settings'],
        },
        {
          id: 'international-payments',
          title: 'International Payments and Settlements',
          icon: HomeIcon,
        },
        { id: 'invoices', title: 'Invoices', icon: InvoicesIcon },
        {
          id: 'route',
          title: 'Route',
          icon: RoutesIcon,
          nextLevelItems: ['Transfers', 'Accounts'],
        },
      ]}
    />
  );
};
TrailingVisibility.storyName = 'Trailing Visibility';

// Starts with nothing pinned
export const PinnableItems: StoryFn<typeof SideNavLink> = () => {
  return (
    <PinnableNav
      items={[
        { id: 'payment-links', title: 'Payment Links', icon: PaymentLinkIcon },
        { id: 'payment-pages', title: 'Payment Pages', icon: PaymentPagesIcon },
        { id: 'qr-codes', title: 'QR Codes', icon: QRCodeIcon },
        {
          id: 'magic-checkout',
          title: 'Magic Checkout',
          icon: MagicCheckoutIcon,
          nextLevelItems: ['Home', 'Orders', 'Settings'],
        },
        { id: 'invoices', title: 'Invoices', icon: InvoicesIcon },
        { id: 'subscriptions', title: 'Subscriptions', icon: SubscriptionsIcon },
      ]}
    />
  );
};
PinnableItems.storyName = 'Pinnable Items';

export const CollapsedVisibility: StoryFn<typeof SideNav> = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <StoryNav initialPath="/home">
      <SideNav position="absolute" top="spacing.0" isExpanded={isExpanded}>
        <SideNavBody>
          <StoryNavLink href="/home" icon={HomeIcon} title="Home" />
          <StoryNavLink href="/invoices" icon={InvoicesIcon} title="Invoices" />
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
    </StoryNav>
  );
};
CollapsedVisibility.storyName = 'SideNavVisibility';
