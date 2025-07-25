import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _MoreVerticalIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 4C9 2.34315 10.3431 1 12 1C13.6569 1 15 2.34315 15 4C15 5.65685 13.6569 7 12 7C10.3431 7 9 5.65685 9 4ZM9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12ZM12 17C10.3431 17 9 18.3431 9 20C9 21.6569 10.3431 23 12 23C13.6569 23 15 21.6569 15 20C15 18.3431 13.6569 17 12 17Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const MoreVerticalIcon = assignWithoutSideEffects(_MoreVerticalIcon, {
  componentId: 'MoreVerticalIcon',
});

export default MoreVerticalIcon;
