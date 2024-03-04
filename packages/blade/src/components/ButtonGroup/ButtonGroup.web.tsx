import React from 'react';
import type { ButtonGroupProps } from './types';
import { StyledButtonGroup } from './StyledButtonGroup';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ButtonGroup = ({
  children,
  isDisabled = false,
  size = 'medium',
  color = 'primary',
  testID,
  ...styledProps
}: ButtonGroupProps): React.ReactElement => {
  return (
    <StyledButtonGroup
      {...metaAttribute({ name: MetaConstants.ButtonGroup, testID })}
      {...getStyledProps(styledProps)}
      {...getStyledProps(styledProps)}
      role="group"
    >
      {React.Children.map(children, (child, index) => {
        return (
          <BaseBox key={index} display="flex" flexDirection="row">
            {child}
          </BaseBox>
        );
      })}
    </StyledButtonGroup>
  );
};

const ButtonGroup = assignWithoutSideEffects(_ButtonGroup, {
  displayName: 'ButtonGroup',
  componentId: 'ButtonGroup',
});

export { ButtonGroup };
export type { ButtonGroupProps };
