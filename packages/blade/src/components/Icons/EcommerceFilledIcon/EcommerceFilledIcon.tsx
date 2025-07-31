import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _EcommerceFilledIcon: IconComponent = ({
  size,
  color,
  ...styledProps
}) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg
      {...styledProps}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.916504 1.91748C0.916504 1.3652 1.36422 0.91748 1.9165 0.91748H5.58317C6.0598 0.91748 6.47018 1.25387 6.56372 1.72122L7.32021 5.50081H22.0832C22.3812 5.50081 22.6637 5.63374 22.8537 5.86337C23.0436 6.093 23.1213 6.39539 23.0655 6.68814L21.5974 14.3865C21.4678 15.0387 21.113 15.6246 20.595 16.0416C20.0798 16.4563 19.4357 16.6777 18.7746 16.6675H9.88174C9.22061 16.6777 8.57659 16.4563 8.06135 16.0416C7.54359 15.6248 7.18885 15.0392 7.05917 14.3873L5.52829 6.73862C5.52177 6.71192 5.51633 6.6848 5.51201 6.65732L4.76349 2.91748H1.9165C1.36422 2.91748 0.916504 2.46977 0.916504 1.91748ZM7.3335 20.334C7.3335 19.2294 8.22893 18.334 9.3335 18.334C10.4381 18.334 11.3335 19.2294 11.3335 20.334C11.3335 21.4386 10.4381 22.334 9.3335 22.334C8.22893 22.334 7.3335 21.4386 7.3335 20.334ZM17.4165 20.334C17.4165 19.2294 18.3119 18.334 19.4165 18.334C20.5211 18.334 21.4165 19.2294 21.4165 20.334C21.4165 21.4386 20.5211 22.334 19.4165 22.334C18.3119 22.334 17.4165 21.4386 17.4165 20.334Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const EcommerceFilledIcon = assignWithoutSideEffects(_EcommerceFilledIcon, {
  componentId: 'EcommerceFilledIcon',
});

export default EcommerceFilledIcon;
