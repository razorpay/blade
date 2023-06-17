import type { KeyboardEventHandler, ReactElement } from 'react';
import { StyledAccordionButton } from './StyledAccordionButton';
import type { AccordionButtonProps } from './types';
import { useAccordion } from './AccordionContext';
import { BaseBox } from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { Heading } from '~components/Typography';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';
import { CollapsibleChevronIcon } from '~components/Collapsible/CollapsibleChevronIcon';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AccordionButton = ({ index, icon: Icon, children }: AccordionButtonProps): ReactElement => {
  const { onExpandChange, isExpanded, collapsibleBodyId } = useCollapsible();
  const { showNumberPrefix, expandedIndex } = useAccordion();

  const toggleCollapse = (): void => onExpandChange(!isExpanded);
  const onClick = (): void => toggleCollapse();
  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    const SPACE_KEY = ' ';
    if (event.key === SPACE_KEY || event.key === 'Enter') {
      toggleCollapse();
    }
  };

  const _index =
    typeof index === 'number' && showNumberPrefix ? (
      <Heading size="small" marginRight="spacing.2">
        {index + 1}.
      </Heading>
    ) : null;

  const _icon = Icon && (
    <Icon size="medium" color="currentColor" marginRight="spacing.3" marginY="spacing.2" />
  );

  if (_index && _icon) {
    throw new Error(`[Blade: Accordion]: showNumberPrefix and icon shouldn't be used together`);
  }

  const isItemExpanded = expandedIndex === index;

  return (
    <BaseBox
      // a11y guidelines suggest having an apt heading surround a button but heading level is hardcoded here
      {...makeAccessible({ role: 'heading', level: 3 })}
      width="100%"
    >
      <StyledAccordionButton
        /**
         * This is a button role rather than an actual button because markup requires following nesting:
         * - heading (AccordionItem wrapper) -> button (trigger) -> heading (blade) for title
         *
         * However, a heading inside a button is invalid markup on web so we need something like a span for
         * inner blade heading https://github.com/razorpay/blade/issues/812
         */
        {...makeAccessible({ role: 'button' })}
        tabIndex={0}
        isExpanded={isItemExpanded}
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...makeAccessible({ expanded: isItemExpanded, controls: collapsibleBodyId })}
        {...metaAttribute({ name: MetaConstants.AccordionButton })}
      >
        <BaseBox display="flex" flexDirection="row" alignItems="flex-start" marginRight="spacing.4">
          {_index}
          {_icon}
          <Heading size="small">{children}</Heading>
        </BaseBox>
        <CollapsibleChevronIcon color="currentColor" size="large" />
      </StyledAccordionButton>
    </BaseBox>
  );
};

const AccordionButton = assignWithoutSideEffects(_AccordionButton, {
  componentId: MetaConstants.AccordionButton,
});

export { AccordionButton, AccordionButtonProps };
