/* eslint-disable @typescript-eslint/ban-types */
import styled from 'styled-components';
import { screenReaderStyles } from '../VisuallyHidden';
import type { InputProps } from './useCheckbox';

const StyledInput = styled.input(({ theme }) => ({
  ...screenReaderStyles,
  '&:focus + div': {
    boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]!}`,
  },
}));

const CheckboxInput = ({ inputProps }: { inputProps: InputProps }): React.ReactElement => {
  return <StyledInput {...inputProps} />;
};

export { CheckboxInput };
