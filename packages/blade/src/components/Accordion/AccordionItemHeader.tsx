import React from 'react';
import { useAccordion, useAccordionItemIndex } from './AccordionContext';
import { componentIds } from './componentIds';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { CollapsibleChevronIcon } from '~components/Collapsible/CollapsibleChevronIcon';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { DataAnalyticsAttribute } from '~utils/types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BoxProps } from '~components/Box';
import { makeSize } from '~utils/makeSize';
import { size as sizeToken } from '~tokens/global';

const getLeadingElementMaxHeightAndWidth = (
  size: BaseHeaderProps['size'],
): BoxProps['maxHeight'] => {
  if (size === 'large') return makeSize(sizeToken['32']);
  return makeSize(sizeToken['24']);
};

const _AccordionItemHeader = ({
  title,
  subtitle,
  leading,
  children,
  trailing,
  titleSuffix,
  ...rest
}: Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'children' | 'trailing' | 'titleSuffix'
> &
  DataAnalyticsAttribute): React.ReactElement => {
  const { size, showNumberPrefix, expandedIndex } = useAccordion();
  const { index, isDisabled } = useAccordionItemIndex();

  const isLeadingIcon =
    React.isValidElement(leading) &&
    typeof leading.type === 'function' &&
    leading.type.name?.endsWith('Icon');

  const isLeadingNumberOrIcon = React.useMemo(() => {
    // Check if leading is a number
    if (showNumberPrefix && typeof index === 'number') return true;

    // Check if leading is an Icon component (name ends with "Icon")
    if (isLeadingIcon) return true;

    return false;
  }, [showNumberPrefix, index, isLeadingIcon]);

  const shouldAlignHeaderItemsInCenter = Boolean(
    children || (Boolean(leading) && !isLeadingNumberOrIcon),
  );

  const leadingElement = React.useMemo(() => {
    if (showNumberPrefix && typeof index === 'number') {
      return (
        <Text size={size} weight="semibold" marginTop="-2px" as="span">
          {index + 1}.
        </Text>
      );
    }
    if (leading) {
      return (
        <BaseBox
          marginRight={isLeadingIcon ? 'spacing.0' : 'spacing.3'}
          marginTop="spacing.1"
          // So in design, we have set max height and width for the leading element, doing same here
          maxHeight={getLeadingElementMaxHeightAndWidth(size)}
          maxWidth={getLeadingElementMaxHeightAndWidth(size)}
          overflow="hidden"
        >
          {leading}
        </BaseBox>
      );
    }
    return null;
  }, [showNumberPrefix, index, leading, size, isLeadingIcon]);

  return (
    <BaseBox {...metaAttribute({ name: MetaConstants.AccordionItemHeader })} flex="1">
      <BaseHeader
        leading={leadingElement}
        title={title}
        subtitle={subtitle}
        trailing={trailing}
        titleSuffix={titleSuffix}
        isDisabled={isDisabled}
        showBackButton={false}
        showCloseButton={false}
        showDivider={expandedIndex === index}
        paddingX="spacing.5"
        marginY="spacing.5"
        size={size}
        alignItems={!subtitle && !isLeadingNumberOrIcon ? 'center' : 'flex-start'}
        dividerProps={{
          thickness: 'thinner',
          marginX: 'spacing.5',
        }}
        trailingInteractionElement={
          <CollapsibleChevronIcon
            color={isDisabled ? 'interactive.icon.gray.disabled' : 'interactive.icon.gray.muted'}
            size="large"
          />
        }
        shouldAlignLeadingAndTrailingElementsToCenter={shouldAlignHeaderItemsInCenter}
        {...makeAnalyticsAttribute(rest)}
      >
        {children}
      </BaseHeader>
    </BaseBox>
  );
};

const AccordionItemHeader = assignWithoutSideEffects(_AccordionItemHeader, {
  componentId: componentIds.AccordionItemHeader,
});

export { AccordionItemHeader };
