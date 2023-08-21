import styled from 'styled-components/native';
import { getBaseActionListStyles } from './getBaseActionListStyles';
import type { StyledActionListProps } from './getBaseActionListStyles';
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
  onTouchEnd,
  onTouchStart,
  onPointerDown,
  onPointerEnter,
  pointerEvents,
  ...props
}: { children: React.ReactNode } & BaseBoxProps & StyledActionListProps): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <BaseStyledActionList
      {...props}
      onPointerEnter={castNativeType(onPointerEnter)}
      onPointerDown={castNativeType(onPointerDown)}
      onTouchStart={castNativeType(onTouchStart)}
      onTouchEnd={castNativeType(onTouchEnd)}
      pointerEvents={castNativeType(pointerEvents)}
      style={props.isInBottomSheet ? undefined : castNativeType(theme.elevation.midRaised)}
    >
      {children}
    </BaseStyledActionList>
  );
};

export { StyledActionList };
