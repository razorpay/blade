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
import { Box } from '~components/Box';
import { makeSize } from '~utils/makeSize';
import { size as sizeToken } from '~tokens/global';

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

  const isLeadingNumberOrIcon = React.useMemo(() => {
    // Check if leading is a number
    if (showNumberPrefix && typeof index === 'number') return true;

    // Check if leading is an Icon component (name ends with "Icon")
    if (
      leading &&
      React.isValidElement(leading) &&
      typeof leading.type === 'function' &&
      leading.type.name?.endsWith('Icon')
    )
      return true;

    return false;
  }, [leading, showNumberPrefix, index]);

  const shouldAlignHeaderItemsInCenter = Boolean(
    children || (Boolean(leading) && !isLeadingNumberOrIcon),
  );
  const trailingInteractionElement = React.useMemo(() => {
    if (shouldAlignHeaderItemsInCenter) {
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          alignSelf="center"
        >
          <CollapsibleChevronIcon
            color={isDisabled ? 'interactive.icon.gray.disabled' : 'interactive.icon.gray.muted'}
            size="large"
          />
        </Box>
      );
    }

    return (
      <CollapsibleChevronIcon
        color={isDisabled ? 'interactive.icon.gray.disabled' : 'interactive.icon.gray.muted'}
        size="large"
      />
    );
  }, [shouldAlignHeaderItemsInCenter, isDisabled]);

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
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          marginRight="spacing.3"
          marginBottom={makeSize(sizeToken['1'])}
        >
          {leading}
        </BaseBox>
      );
    }
    return null;
  }, [showNumberPrefix, index, leading, size]);

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
        trailingInteractionElement={trailingInteractionElement}
        removeWrapperInTrailingInteractionElements={shouldAlignHeaderItemsInCenter}
        removeWrapperInLeadingInteractionElements={shouldAlignHeaderItemsInCenter}
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
