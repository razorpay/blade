import type { ReactElement } from 'react';
import getIn from '../../../utils/getIn';
import BaseText from '../../Typography/BaseText';
import { useTheme } from '../../BladeProvider';
import StyledBaseButton from './StyledBaseButton';

export type BaseButtonProps = {
  children: string;
};

const BaseButton = ({ children }: BaseButtonProps): ReactElement => {
  const { theme } = useTheme();
  const buttonColor = getIn(theme.colors, 'action.background.primary.default');
  console.log('🚀 ~ file: BaseButton.tsx ~ line 14 ~ BaseButton ~ buttonColor', buttonColor);
  const hoverColor = getIn(theme.colors, 'action.background.primary.hover');

  return (
    <StyledBaseButton
      color={buttonColor}
      hoverColor={hoverColor}
      onClick={(): void => {
        console.log('clicked');
      }}
    >
      <BaseText
        lineHeight="s"
        fontSize={100}
        fontWeight="bold"
        textAlign="center"
        color="action.text.primary.default"
      >
        {children}
      </BaseText>
    </StyledBaseButton>
  );
};

export default BaseButton;
