import type { IndicatorButtonProps } from './types';
import { StyledIndicatorButton } from './StyledIndicatorButton';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import { isReactNative } from '~utils';

const IndicatorButton = ({
  onClick,
  isActive,
  variant,
  ...props
}: IndicatorButtonProps & BaseBoxProps): React.ReactElement => {
  return (
    <StyledIndicatorButton
      as={(isReactNative() ? undefined : 'button') as never}
      {...props}
      isActive={isActive}
      variant={variant}
      onClick={onClick}
    />
  );
};

export { IndicatorButton };
