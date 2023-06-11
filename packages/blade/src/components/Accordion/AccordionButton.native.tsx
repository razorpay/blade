import type { ReactElement } from 'react';
import { StyledAccordionButton } from './StyledAccordionButton';
import { Heading } from '~components/Typography';

type AccordionButtonProps = {
  children: string;
};

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

export { AccordionButton, AccordionButtonProps };
