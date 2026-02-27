import type { IndicatorButtonProps } from './types';
import { StyledIndicatorButton } from './StyledIndicatorButton';
import { metaAttribute } from '~utils/metaAttribute';
import type { BaseBoxProps } from '~components/Box/BaseBox';

const IndicatorButton = ({
  onClick,
  isActive,
  variant,
  ...props
}: IndicatorButtonProps & BaseBoxProps): React.ReactElement => {
  return (
    <StyledIndicatorButton
      {...props}
      {...metaAttribute({ name: 'carousel-indicator-button' })}
      isActive={isActive}
      variant={variant}
      onClick={onClick}
    />
  );
};

export { IndicatorButton };
