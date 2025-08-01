import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _TvIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.70711 1.29289C7.31658 0.902369 6.68342 0.902369 6.29289 1.29289C5.90237 1.68342 5.90237 2.31658 6.29289 2.70711L9.58579 6H4C2.34315 6 1 7.34315 1 9V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V9C23 7.34315 21.6569 6 20 6H14.4142L17.7071 2.70711C18.0976 2.31658 18.0976 1.68342 17.7071 1.29289C17.3166 0.902369 16.6834 0.902369 16.2929 1.29289L12 5.58579L7.70711 1.29289ZM3 9C3 8.44772 3.44772 8 4 8H20C20.5523 8 21 8.44772 21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const TvIcon = assignWithoutSideEffects(_TvIcon, {
  componentId: 'TvIcon',
});

export default TvIcon;
