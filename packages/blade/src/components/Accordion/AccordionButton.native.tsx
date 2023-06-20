import type { ReactElement } from 'react';
import { StyledAccordionButton } from './StyledAccordionButton';
import type { AccordionButtonProps } from './types';
import { Heading } from '~components/Typography';

// TODO: implement with reanimated, pressable
const AccordionButton = ({ children }: AccordionButtonProps): ReactElement => {
  return (
    <StyledAccordionButton
      // TODO: add logic
      isExpanded={false}
    >
      <Heading size="small">{children}</Heading>
    </StyledAccordionButton>
  );
};

export { AccordionButton };
