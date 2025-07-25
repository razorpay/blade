import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _CornerLeftDownIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 3C10.2386 3 8 5.23858 8 8V17.5858L4.70711 14.2929C4.31658 13.9024 3.68342 13.9024 3.29289 14.2929C2.90237 14.6834 2.90237 15.3166 3.29289 15.7071L8.29289 20.7071C8.68342 21.0976 9.31658 21.0976 9.70711 20.7071L14.7071 15.7071C15.0976 15.3166 15.0976 14.6834 14.7071 14.2929C14.3166 13.9024 13.6834 13.9024 13.2929 14.2929L10 17.5858V8C10 6.34315 11.3431 5 13 5H20C20.5523 5 21 4.55228 21 4C21 3.44772 20.5523 3 20 3H13Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const CornerLeftDownIcon = assignWithoutSideEffects(_CornerLeftDownIcon, {
  componentId: 'CornerLeftDownIcon',
});

export default CornerLeftDownIcon;
