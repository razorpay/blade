import type { IndicatorButtonProps } from './types';
import { StyledIndicatorButton } from './StyledIndicatorButton';
import type { BaseBoxProps } from '~components/Box/BaseBox';

const IndicatorButton = ({
  onClick,
  isActive,
  variant,
  ...props
}: IndicatorButtonProps & BaseBoxProps): React.ReactElement => {
  return (
    <StyledIndicatorButton
      as="button"
      {...props}
      isActive={isActive}
      variant={variant}
      onClick={onClick}
    />
  );
};

export { IndicatorButton };
