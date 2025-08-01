import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BfsiIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0001 3C10.0001 1.89543 10.8955 1 12.0001 1C13.1047 1 14.0001 1.89543 14.0001 3C14.0001 4.10457 13.1047 5 12.0001 5C10.8955 5 10.0001 4.10457 10.0001 3ZM4.16806 3.4453C4.47441 2.98577 5.09528 2.8616 5.55481 3.16795L12.0001 7.46482L18.4454 3.16795C18.9049 2.8616 19.5258 2.98577 19.8322 3.4453C20.1385 3.90483 20.0143 4.5257 19.5548 4.83205L13.8029 8.66667L15.2028 9.59993C16.925 10.7481 16.9946 13.2542 15.3387 14.4961L13.6668 15.75L19.6001 20.2C20.0419 20.5314 20.1315 21.1582 19.8001 21.6C19.4687 22.0418 18.8419 22.1314 18.4001 21.8L12.0001 17L5.60011 21.8C5.15828 22.1314 4.53148 22.0418 4.20011 21.6C3.86874 21.1582 3.95828 20.5314 4.40011 20.2L10.3334 15.75L8.66154 14.4961C7.00565 13.2542 7.07521 10.7481 8.79744 9.59993L10.1973 8.66667L4.44541 4.83205C3.98588 4.5257 3.8617 3.90483 4.16806 3.4453ZM12.0001 9.86852L9.90684 11.264C9.33277 11.6467 9.30958 12.4821 9.86154 12.8961L12.0001 14.5L14.1387 12.8961C14.6906 12.4821 14.6674 11.6467 14.0934 11.264L12.0001 9.86852Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const BfsiIcon = assignWithoutSideEffects(_BfsiIcon, {
  componentId: 'BfsiIcon',
});

export default BfsiIcon;
