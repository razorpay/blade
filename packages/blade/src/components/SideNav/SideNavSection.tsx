import React from 'react';
import styled from 'styled-components';
import type { SideNavSectionProps } from './types';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Collapsible, CollapsibleBody } from '~components/Collapsible';
import BaseBox from '~components/Box/BaseBox';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';
import { Link } from '~components/Link';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { Divider } from '~components/Divider';

const ShowMoreLink = ({
  collapsedItemsCount,
}: {
  collapsedItemsCount: number;
}): React.ReactElement => {
  const { isExpanded, onExpandChange } = useCollapsible();
  const toggleCollapse = (): void => onExpandChange(!isExpanded);
  const linkProps = {
    size: 'small',
    color: 'neutral',
    variant: 'button',
    onClick: toggleCollapse,
    marginY: 'spacing.2',
  } as const;

  return (
    <>
      <BaseBox className="show-when-collapsed" width="100%" justifyContent="center">
        <Link {...linkProps} marginX="spacing.3">
          {isExpanded ? `-${collapsedItemsCount}` : `+${collapsedItemsCount}`}
        </Link>
      </BaseBox>
      <BaseBox className="hide-when-collapsed">
        <Link
          {...linkProps}
          marginX="spacing.4"
          icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
          iconPosition="right"
        >
          {isExpanded ? 'Show Less' : `+${collapsedItemsCount} More`}
        </Link>
      </BaseBox>
    </>
  );
};

const StyledSectionTitleContainer = styled(BaseBox)((_props) => {
  return {
    '.collapsed:not(.transitioning) & p': {
      opacity: 0,
    },
  };
});

const SideNavSection = ({
  children,
  title,
  maxVisibleItems = 999,
  onToggleVisibleItems,
}: SideNavSectionProps): React.ReactElement => {
  const totalItemsCount = React.Children.count(children);
  const collapsedItemsCount = totalItemsCount - maxVisibleItems;

  return (
    <Box paddingY="spacing.6">
      <StyledSectionTitleContainer position="relative" padding={['spacing.2', 'spacing.4']}>
        <Text size="xsmall" weight="medium" truncateAfterLines={1} color="surface.text.gray.muted">
          {title}
        </Text>
        <BaseBox
          className="show-when-collapsed"
          position="absolute"
          top="50%"
          margin="auto"
          left="spacing.0"
          right="spacing.0"
          transform="translateY(-50%)"
        >
          <Divider />
        </BaseBox>
      </StyledSectionTitleContainer>
      <Box>{children.slice(0, maxVisibleItems)}</Box>
      <Collapsible
        direction="top"
        _dangerouslyDisableValidations={true}
        _shouldApplyWidthRestrictions={false}
        onExpandChange={onToggleVisibleItems}
      >
        <ShowMoreLink collapsedItemsCount={collapsedItemsCount} />
        <CollapsibleBody width="100%" _hasMargin={false}>
          {children.slice(maxVisibleItems)}
        </CollapsibleBody>
      </Collapsible>
    </Box>
  );
};

export { SideNavSection };
