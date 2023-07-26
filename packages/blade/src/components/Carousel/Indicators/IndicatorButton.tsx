import type { IndicatorButtonProps } from './types';
import { StyledIndicatorButton } from './StyledIndicatorButton';

const IndicatorButton = ({
  onClick,
  isActive,
  variant,
}: IndicatorButtonProps): React.ReactElement => {
  return <StyledIndicatorButton isActive={isActive} variant={variant} onClick={onClick} />;
};

export { IndicatorButton };
