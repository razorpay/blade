import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _CornerRightDownIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 3C3.44772 3 3 3.44772 3 4C3 4.55228 3.44772 5 4 5H11C12.6569 5 14 6.34315 14 8V17.5858L10.7071 14.2929C10.3166 13.9024 9.68342 13.9024 9.29289 14.2929C8.90237 14.6834 8.90237 15.3166 9.29289 15.7071L14.2929 20.7071C14.6834 21.0976 15.3166 21.0976 15.7071 20.7071L20.7071 15.7071C21.0976 15.3166 21.0976 14.6834 20.7071 14.2929C20.3166 13.9024 19.6834 13.9024 19.2929 14.2929L16 17.5858V8C16 5.23858 13.7614 3 11 3H4Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const CornerRightDownIcon = assignWithoutSideEffects(_CornerRightDownIcon, {
  componentId: 'CornerRightDownIcon',
});

export default CornerRightDownIcon;
