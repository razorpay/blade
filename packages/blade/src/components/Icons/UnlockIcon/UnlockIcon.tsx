import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _UnlockIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.598 3.01522C13.6426 2.8087 15.5111 4.18508 15.92 6.19899C16.0299 6.74023 16.5578 7.0899 17.099 6.98C17.6402 6.8701 17.9899 6.34224 17.88 5.801C17.2666 2.78013 14.4639 0.71556 11.397 1.02535C8.32071 1.33609 6 3.99656 6 7V10H5C3.34315 10 2 11.3431 2 13V20C2 21.6569 3.34315 23 5 23H19C20.6569 23 22 21.6569 22 20V13C22 11.3431 20.6569 10 19 10H16.9024L16.9 10H8V7C8 5.00355 9.56277 3.2208 11.598 3.01522ZM4 13C4 12.4477 4.44772 12 5 12H19C19.5523 12 20 12.4477 20 13V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V13Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const UnlockIcon = assignWithoutSideEffects(_UnlockIcon, {
  componentId: 'UnlockIcon',
});

export default UnlockIcon;
