import type { ReactElement } from 'react';
import { StyledAccordionButton } from './StyledAccordionButton';
import { BaseBox } from '~components/Box/BaseBox';
import { makeAccessible } from '~utils';
import { Heading } from '~components/Typography';
import { ChevronDownIcon } from '~components/Icons';

type AccordionButtonProps = {
  children: string;
};

const AccordionButton = ({ children }: AccordionButtonProps): ReactElement => {
  return (
    <BaseBox
      // a11y guidelines suggest having a heading surround a button but heading level is hardcoded here
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
      >
        <Heading size="small">{children}</Heading>
        <ChevronDownIcon color="currentColor" size="large" />
      </StyledAccordionButton>
    </BaseBox>
  );
};

export { AccordionButton, AccordionButtonProps };
