import BaseButton from '../BaseButton';
import type { IconComponent } from '~components/Icons';

type ButtonCommonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
  accessibilityLabel?: string;
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
  isLoading = false,
  onClick,
  size = 'medium',
  type = 'button',
  variant = 'primary',
  accessibilityLabel,
}: ButtonProps): React.ReactElement => {
  return (
    <BaseButton
      {...(icon ? { icon, children } : { children })}
      accessibilityLabel={accessibilityLabel}
      iconPosition={iconPosition}
      isDisabled={isDisabled}
      isFullWidth={isFullWidth}
      onClick={onClick}
      size={size}
      type={type}
      variant={variant}
      isLoading={isLoading}
    />
  );
};

export default Button;
