import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _FolderIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V8C21 7.44772 20.5523 7 20 7H11C10.6656 7 10.3534 6.8329 10.1679 6.5547L8.46482 4H4ZM1 5C1 3.34315 2.34315 2 4 2H9C9.33435 2 9.64658 2.1671 9.83205 2.4453L11.5352 5H20C21.6569 5 23 6.34315 23 8V19C23 20.6569 21.6569 22 20 22H4C2.34315 22 1 20.6569 1 19V5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const FolderIcon = assignWithoutSideEffects(_FolderIcon, {
  componentId: 'FolderIcon',
});

export default FolderIcon;
