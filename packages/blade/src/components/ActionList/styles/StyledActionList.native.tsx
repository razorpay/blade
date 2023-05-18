import styled from 'styled-components/native';
import { getBaseActionListStyles } from './getBaseActionListStyles';
import type { StyledActionListProps } from './getBaseActionListStyles';
// import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import { castNativeType } from '~utils';
import { useTheme } from '~components/BladeProvider';

const BaseStyledActionList = styled(BaseBox)<StyledActionListProps>((props) => {
  return {
    ...getBaseActionListStyles(props),
  };
});

const StyledActionList = ({
  children,
  ...props
}: { children: React.ReactNode } & BaseBoxProps & StyledActionListProps): JSX.Element => {
  const { theme } = useTheme();

  return (
    <BaseStyledActionList
      {...props}
      style={props.isInBottomSheet ? undefined : castNativeType(theme.elevation.midRaised)}
    >
      {children}
    </BaseStyledActionList>
  );
};

export { StyledActionList };
