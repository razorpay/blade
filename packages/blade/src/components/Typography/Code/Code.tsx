import styled from 'styled-components';
import { BaseText } from '../BaseText';

const StyledCode = styled(BaseText)((props) => {
  return {
    backgroundColor: props.theme.colors.brand.gray[300],
    color: props.theme.colors.surface.text.subtle.lowContrast,
    padding: `0 ${props.theme.spacing[2]}`,
  };
});

function Code({ children }: { children: string }): JSX.Element {
  return <StyledCode as="code">{children}</StyledCode>;
}

export { Code };
