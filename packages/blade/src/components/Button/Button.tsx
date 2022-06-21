import type { IconComponent } from '../Icons';
import BaseButton from './BaseButton';

type ButtonCommonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'reset' | 'submit';
};

/*
  Mandatory children prop when icon is not provided
  */
type ButtonWithoutIconProps = ButtonCommonProps & {
  icon?: undefined;
  children: string;
};

/*
   Optional children prop when icon is provided
  */
type ButtonWithIconProps = ButtonCommonProps & {
  icon: IconComponent;
  children?: string;
};

export type ButtonProps = ButtonWithoutIconProps | ButtonWithIconProps;

const Button = ({
  children,
  icon,
  iconPosition,
  isDisabled,
  isFullWidth,
  onClick,
  size = 'medium',
  type = 'button',
  variant = 'primary',
}: ButtonProps): React.ReactElement => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error temporarily ignore this error
    <BaseButton
      icon={icon}
      iconPosition={iconPosition}
      isDisabled={isDisabled}
      isFullWidth={isFullWidth}
      onClick={onClick}
      size={size}
      type={type}
      variant={variant}
    >
      {children}
    </BaseButton>
  );
};

export default Button;
