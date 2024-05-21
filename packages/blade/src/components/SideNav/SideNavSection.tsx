import React from 'react';
import styled from 'styled-components';
import type { SideNavSectionProps } from './types';
import { classes } from './tokens';
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
      <BaseBox className={classes.SHOW_WHEN_COLLAPSED} width="100%" justifyContent="center">
        <Link {...linkProps} marginX="spacing.3">
          {isExpanded ? `-${collapsedItemsCount}` : `+${collapsedItemsCount}`}
        </Link>
      </BaseBox>
      <BaseBox className={classes.HIDE_WHEN_COLLAPSED}>
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
  maxVisibleItems,
  onToggleVisibleItems,
}: SideNavSectionProps): React.ReactElement => {
  const totalItemsCount = React.Children.count(children);
  const collapsedItemsCount = maxVisibleItems ? totalItemsCount - maxVisibleItems : undefined;

  return (
    <Box paddingY="spacing.3">
      {title ? (
        <StyledSectionTitleContainer position="relative" padding={['spacing.2', 'spacing.4']}>
          <Text
            size="xsmall"
            weight="medium"
            truncateAfterLines={1}
            color="surface.text.gray.muted"
          >
            {title?.toUpperCase()}
          </Text>
          <BaseBox
            className={classes.SHOW_WHEN_COLLAPSED}
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
      ) : null}

      <Box>{maxVisibleItems ? children.slice(0, maxVisibleItems) : children}</Box>
      {maxVisibleItems ? (
        <Collapsible
          direction="top"
          _dangerouslyDisableValidations={true}
          _shouldApplyWidthRestrictions={false}
          onExpandChange={onToggleVisibleItems}
        >
          <ShowMoreLink collapsedItemsCount={collapsedItemsCount!} />
          <CollapsibleBody width="100%" _hasMargin={false}>
            {children.slice(maxVisibleItems)}
          </CollapsibleBody>
        </Collapsible>
      ) : null}
    </Box>
  );
};

export { SideNavSection };
