import type { ReactElement } from 'react';
import { StyledAccordionButton } from './StyledAccordionButton';
import type { AccordionButtonProps } from './types';
import { useAccordion } from './AccordionContext';
import { AccordionItemHeader } from './AccordionItemHeader';
import { BaseBox } from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { Text } from '~components/Typography';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { MAKE_ANALYTICS_CONSTANTS } from '~utils/makeAnalyticsAttribute';

const _AccordionButton = ({
  index,
  icon: Icon,
  title,
  isDeprecatedAPI,
  header,
  isDisabled,
}: AccordionButtonProps): ReactElement => {
  const { onExpandChange, isExpanded, collapsibleBodyId } = useCollapsible();
  const { showNumberPrefix, expandedIndex, size } = useAccordion();

  const toggleCollapse = (): void => onExpandChange(!isExpanded);
  const onClick = (): void => toggleCollapse();

  const _index =
    typeof index === 'number' && showNumberPrefix ? (
      // we have to add -2px margin to align the number with title of BaseHeader
      <Text size={size} weight="semibold" marginTop="-2px" as="span">
        {index + 1}.
      </Text>
    ) : null;

  const _icon = Icon && <Icon size={size} color="surface.icon.gray.normal" marginY="spacing.2" />;

  if (__DEV__) {
    if (_index && _icon) {
      throwBladeError({
        message: "showNumberPrefix and icon shouldn't be used together",
        moduleName: 'Accordion',
      });
    }
  }

  const isItemExpanded = expandedIndex === index;

  return (
    <BaseBox
      // a11y guidelines suggest having an apt heading surround a button but heading level is hardcoded here
      {...makeAccessible({ role: 'heading', level: 3 })}
      width="100%"
    >
      <StyledAccordionButton
        type="button"
        isExpanded={isItemExpanded}
        disabled={isDisabled}
        onClick={onClick}
        {...makeAccessible({ expanded: isItemExpanded, controls: collapsibleBodyId })}
        {...metaAttribute({ name: MetaConstants.AccordionButton })}
        data-analytics-name={MAKE_ANALYTICS_CONSTANTS.ACCORDION.ACCORDION_ITEM_BUTTON}
      >
        {isDeprecatedAPI ? <AccordionItemHeader title={title} leading={_icon ?? _index} /> : header}
      </StyledAccordionButton>
    </BaseBox>
  );
};

const AccordionButton = assignWithoutSideEffects(_AccordionButton, {
  componentId: MetaConstants.AccordionButton,
});

export type { AccordionButtonProps };
export { AccordionButton };
