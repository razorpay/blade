import styled from 'styled-components/native';
import type { StyledAccordionButtonProps } from './types';

// TODO: implement
const StyledAccordionButton = styled.Pressable<StyledAccordionButtonProps>((props) => {
  const { theme, isExpanded } = props;
  return {
    backgroundColor: isExpanded ? theme.colors.brand.gray.a50.lowContrast : undefined,
  };
});

export { StyledAccordionButton };
