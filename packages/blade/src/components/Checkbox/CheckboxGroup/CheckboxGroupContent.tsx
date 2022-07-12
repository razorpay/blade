import React from 'react';
import styled from 'styled-components';
import makeSpace from '../../../utils/makeSpace';
import type { CheckboxGroupProps } from './CheckboxGroup';
import { useCheckboxGroupContext } from './CheckboxGroupContext';

const StyledCheckboxGroupContent = styled.div<Pick<CheckboxGroupProps, 'labelPosition'>>(
  ({ theme, labelPosition }) => {
    return {
      display: 'flex',
      flexDirection: 'column',
      marginTop: labelPosition === 'top' ? makeSpace(theme.spacing[1]) : 'auto',
      marginBottom: makeSpace(theme.spacing[1]),
      gap: makeSpace(theme.spacing[1]),
    };
  },
);

type CheckboxGroupContentProps = {
  children: React.ReactNode;
};

const CheckboxGroupContent = ({ children }: CheckboxGroupContentProps): React.ReactElement => {
  const { labelPosition } = useCheckboxGroupContext();

  return (
    <StyledCheckboxGroupContent labelPosition={labelPosition}>
      {children}
    </StyledCheckboxGroupContent>
  );
};

export { CheckboxGroupContent };
