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
  const { size, showNumberPrefix } = useAccordion();
  const { index, isDisabled } = useAccordionItemIndex();

  return (
    <BaseBox {...metaAttribute({ name: MetaConstants.AccordionItemHeader })} flex="1">
      <BaseHeader
        leading={
          showNumberPrefix && typeof index === 'number' ? (
            // we have to add -2px margin to align the number with title of BaseHeader
            <Text size={size} weight="semibold" marginTop="-2px" as="span">
              {index + 1}.
            </Text>
          ) : (
            leading
          )
        }
        title={title}
        subtitle={subtitle}
        trailing={trailing}
        titleSuffix={titleSuffix}
        isDisabled={isDisabled}
        showBackButton={false}
        showCloseButton={false}
        showDivider={false}
        paddingX="spacing.5"
        marginY="spacing.5"
        size={size}
        trailingInteractionElement={
          <CollapsibleChevronIcon
            color={isDisabled ? 'interactive.icon.gray.disabled' : 'interactive.icon.gray.muted'}
            size="large"
          />
        }
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
