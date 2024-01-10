import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const EditInlineIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.7071 1.29289C14.3166 0.902369 13.6834 0.902369 13.2929 1.29289L2.29289 12.2929C2.10536 12.4804 2 12.7348 2 13V17C2 17.5523 2.44772 18 3 18H7C7.26522 18 7.51957 17.8946 7.70711 17.7071L18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289L14.7071 1.29289ZM4 16V13.4142L14 3.41421L16.5858 6L6.58579 16H4Z"
        fill={iconColor}
      />
      <Path
        d="M3 21C2.44772 21 2 21.4477 2 22C2 22.5523 2.44772 23 3 23H21C21.5523 23 22 22.5523 22 22C22 21.4477 21.5523 21 21 21H3Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default EditInlineIcon;
