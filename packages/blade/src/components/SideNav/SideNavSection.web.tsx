import React from 'react';
import styled from 'styled-components';
import type { SideNavSectionProps } from './types';
import { classes } from './tokens';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Collapsible, CollapsibleBody } from '~components/Collapsible';
import BaseBox from '~components/Box/BaseBox';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { makeBorderSize } from '~utils';
import { BaseLink } from '~components/Link/BaseLink';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const SideNavTitleDivider = styled(BaseBox)(({ theme }) => {
  return {
    height: makeBorderSize(theme.border.width.thicker),
    width: '100%',
    background: `linear-gradient(90deg, ${theme.colors.transparent} 0%, ${theme.colors.surface.border.gray.muted} 50%, ${theme.colors.transparent} 100%)`,
  };
});

const FullWidthLink = styled(BaseLink)(() => {
  return {
    width: '100%',
  };
});

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
        <FullWidthLink
          {...linkProps}
          marginX="spacing.4"
          icon={isExpanded ? ChevronUpIcon : undefined}
          iconPosition="right"
        >
          {isExpanded ? `` : `+${collapsedItemsCount}`}
        </FullWidthLink>
      </BaseBox>
      <BaseBox className={classes.HIDE_WHEN_COLLAPSED} width="100%">
        <FullWidthLink
          {...linkProps}
          marginX="spacing.4"
          icon={isExpanded ? ChevronUpIcon : ChevronDownIcon}
          iconPosition="right"
        >
          {isExpanded ? 'Show Less' : `+${collapsedItemsCount} More`}
        </FullWidthLink>
      </BaseBox>
    </>
  );
};

const StyledSectionTitleContainer = styled(BaseBox)((_props) => {
  return {
    [`.${classes.COLLAPSED}:not(.${classes.TRANSITIONING}) & p`]: {
      // We only make it opacity 0 to maintain the height of the title in collapsed state
      opacity: 0,
    },
  };
});

const SideNavSection = ({
  children,
  title,
  defaultIsExpanded,
  maxVisibleItems,
  onExpandChange,
  ...rest
}: SideNavSectionProps): React.ReactElement => {
  const totalItemsCount = React.Children.count(children);
  const collapsedItemsCount = maxVisibleItems ? totalItemsCount - maxVisibleItems : undefined;

  return (
    <Box paddingY="spacing.3" {...makeAnalyticsAttribute(rest)}>
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
            <SideNavTitleDivider />
          </BaseBox>
        </StyledSectionTitleContainer>
      ) : null}

      <Box>{maxVisibleItems ? children.slice(0, maxVisibleItems) : children}</Box>
      {maxVisibleItems ? (
        <Collapsible
          direction="top"
          _dangerouslyDisableValidations={true}
          _shouldApplyWidthRestrictions={false}
          onExpandChange={onExpandChange}
          defaultIsExpanded={defaultIsExpanded}
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
