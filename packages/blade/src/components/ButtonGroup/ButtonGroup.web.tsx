import React from 'react';
import type { ButtonGroupProps } from './types';
import { StyledButtonGroup } from './StyledButtonGroup';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { Divider } from '~components/Divider';

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
      <BaseBox display="flex" flexDirection="row">
        {React.Children.map(children, (child, index) => {
          return (
            <>
              {child}
              {React.Children.count(children) - 1 !== index && (
                <Divider variant="subtle" orientation="vertical" />
              )}
            </>
          );
        })}
      </BaseBox>
    </StyledButtonGroup>
  );
};

const ButtonGroup = assignWithoutSideEffects(_ButtonGroup, {
  displayName: 'ButtonGroup',
  componentId: 'ButtonGroup',
});

export { ButtonGroup };
export type { ButtonGroupProps };
