import React from 'react';
import type { SideNavSectionProps } from './types';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Collapsible, CollapsibleBody, CollapsibleLink } from '~components/Collapsible';

const SideNavSection = ({
  children,
  title,
  maxVisibleItems = 999,
  onToggleVisibleItems,
}: SideNavSectionProps): React.ReactElement => {
  const [isCurrentItemExpanded, setIsCurrentItemExpanded] = React.useState(false);
  const totalItemsCount = React.Children.count(children);
  const collapsedItemsCount = totalItemsCount - maxVisibleItems;

  return (
    <Box paddingY="spacing.6">
      <Box padding={['spacing.2', 'spacing.4']}>
        <Text size="xsmall" weight="medium" color="surface.text.gray.muted">
          {title}
        </Text>
      </Box>
      <Box>{children.slice(0, maxVisibleItems)}</Box>
      <Collapsible
        direction="top"
        _shouldApplyWidthRestrictions={false}
        onExpandChange={({ isExpanded }) => {
          setIsCurrentItemExpanded(isExpanded);
          onToggleVisibleItems?.({ isExpanded });
        }}
      >
        <CollapsibleLink margin={['spacing.2', 'spacing.4']} size="small" color="neutral">
          {isCurrentItemExpanded ? 'Show Less' : `+${collapsedItemsCount} More`}
        </CollapsibleLink>
        <CollapsibleBody width="100%" _hasMargin={false}>
          {children.slice(maxVisibleItems)}
        </CollapsibleBody>
      </Collapsible>
    </Box>
  );
};

export { SideNavSection };
