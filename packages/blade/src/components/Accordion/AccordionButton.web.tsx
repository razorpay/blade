import type { ReactElement } from 'react';
import { StyledAccordionButton } from './StyledAccordionButton';
import type { AccordionButtonProps } from './types';
import { useAccordion } from './AccordionContext';
import { BaseBox } from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { Text } from '~components/Typography';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';
import { CollapsibleChevronIcon } from '~components/Collapsible/CollapsibleChevronIcon';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';

const _AccordionButton = ({ index, icon: Icon, children }: AccordionButtonProps): ReactElement => {
  const { onExpandChange, isExpanded, collapsibleBodyId } = useCollapsible();
  const { showNumberPrefix, expandedIndex } = useAccordion();

  const toggleCollapse = (): void => onExpandChange(!isExpanded);
  const onClick = (): void => toggleCollapse();

  const _index =
    typeof index === 'number' && showNumberPrefix ? (
      <Text size="large" weight="semibold" marginRight="spacing.2" as="span">
        {index + 1}.
      </Text>
    ) : null;

  const _icon = Icon && (
    <Icon size="medium" color="currentColor" marginRight="spacing.3" marginY="spacing.2" />
  );

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
        isExpanded={isItemExpanded}
        onClick={onClick}
        {...makeAccessible({ expanded: isItemExpanded, controls: collapsibleBodyId })}
        {...metaAttribute({ name: MetaConstants.AccordionButton })}
      >
        <BaseBox display="flex" flexDirection="row" alignItems="flex-start" marginRight="spacing.4">
          {_index}
          {_icon}
          <Text size="large" weight="semibold" as="span">
            {children}
          </Text>
        </BaseBox>
        <CollapsibleChevronIcon color="currentColor" size="large" />
      </StyledAccordionButton>
    </BaseBox>
  );
};

const AccordionButton = assignWithoutSideEffects(_AccordionButton, {
  componentId: MetaConstants.AccordionButton,
});

export type { AccordionButtonProps };
export { AccordionButton };
