import type { IconComponent } from '../../Icons';
import BaseButton from '../BaseButton';

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
  iconPosition = 'left',
  isDisabled = false,
  isFullWidth = false,
  onClick,
  size = 'medium',
  type = 'button',
  variant = 'primary',
}: ButtonProps): React.ReactElement => {
  return (
    <BaseButton
      {...(icon ? { icon, children } : { icon, children })}
      iconPosition={iconPosition}
      isDisabled={isDisabled}
      isFullWidth={isFullWidth}
      onClick={onClick}
      size={size}
      type={type}
      variant={variant}
    />
  );
};

export default Button;
