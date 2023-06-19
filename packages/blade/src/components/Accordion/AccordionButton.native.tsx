import type { ReactElement } from 'react';
import { StyledAccordionButton } from './StyledAccordionButton';
import type { AccordionButtonProps } from './types';
import { Heading } from '~components/Typography';
import { MetaConstants, assignWithoutSideEffects } from '~utils';

// TODO: implement with reanimated, pressable
const _AccordionButton = ({ children }: AccordionButtonProps): ReactElement => {
  return (
    <StyledAccordionButton
      // TODO: add logic
      isExpanded={false}
    >
      <Heading size="small">{children}</Heading>
    </StyledAccordionButton>
  );
};

const AccordionButton = assignWithoutSideEffects(_AccordionButton, {
  componentId: MetaConstants.AccordionButton,
});

export { AccordionButton };
