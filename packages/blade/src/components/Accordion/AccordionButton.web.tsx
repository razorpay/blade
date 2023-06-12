import type { ReactElement } from 'react';
import { StyledAccordionButton } from './StyledAccordionButton';
import type { AccordionButtonProps } from './types';
import { BaseBox } from '~components/Box/BaseBox';
import { makeAccessible } from '~utils';
import { Heading } from '~components/Typography';
import { ChevronDownIcon } from '~components/Icons';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';

const AccordionButton = ({ index, icon: Icon, children }: AccordionButtonProps): ReactElement => {
  const { setIsExpanded } = useCollapsible();

  const onClick = (): void => setIsExpanded((prev) => !prev);

  const _index =
    typeof index === 'number' ? (
      <Heading size="small" marginRight="spacing.2">
        {index + 1}.
      </Heading>
    ) : null;

  const _icon = Icon && (
    <Icon size="medium" color="currentColor" marginRight="spacing.3" marginY="spacing.2" />
  );

  if (_index && _icon) {
    console.warn(`[Blade: Accordion]: showNumberPrefix and icon shouldn't be used together`);
  }

  return (
    <BaseBox
      // a11y guidelines suggest having an apt heading surround a button but heading level is hardcoded here
      {...makeAccessible({ role: 'heading', level: 3 })}
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
        // TODO: add logic
        isExpanded={false}
        onClick={onClick}
      >
        <BaseBox display="flex" flexDirection="row" alignItems="flex-start">
          {_index}
          {_icon}
          <Heading size="small">{children}</Heading>
        </BaseBox>
        <ChevronDownIcon color="currentColor" size="large" marginLeft="spacing.4" />
      </StyledAccordionButton>
    </BaseBox>
  );
};

export { AccordionButton, AccordionButtonProps };
