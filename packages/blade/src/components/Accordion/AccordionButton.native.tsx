import type { ReactElement } from 'react';
import { StyledAccordionButton } from './StyledAccordionButton.native';
import type { AccordionButtonProps } from './types';
import { Heading } from '~components/Typography';
import { MetaConstants, assignWithoutSideEffects } from '~utils';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';

// TODO: implement with reanimated, pressable
const _AccordionButton = ({ children }: AccordionButtonProps): ReactElement => {
  const { onExpandChange, isExpanded } = useCollapsible();
  // const { showNumberPrefix, expandedIndex } = useAccordion();

  return (
    <StyledAccordionButton
      // TODO: add logic
      isExpanded={isExpanded}
      onPress={() => onExpandChange(!isExpanded)}
    >
      <Heading size="small">{children}</Heading>
    </StyledAccordionButton>
  );
};

const AccordionButton = assignWithoutSideEffects(_AccordionButton, {
  componentId: MetaConstants.AccordionButton,
});

export { AccordionButton };
