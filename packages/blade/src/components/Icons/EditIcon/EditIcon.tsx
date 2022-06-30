import type { ReactElement } from 'react';
import { Svg, Path } from '../_Svg';
import type { IconProps } from '..';
import useIconProps from '../useIconProps';

const EditIcon = ({ size, color }: IconProps): ReactElement => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.2929 0.292893C13.6834 -0.0976311 14.3166 -0.0976311 14.7071 0.292893L19.7071 5.29289C20.0976 5.68342 20.0976 6.31658 19.7071 6.70711L6.70711 19.7071C6.51957 19.8946 6.26522 20 6 20H1C0.447715 20 0 19.5523 0 19V14C0 13.7348 0.105357 13.4804 0.292893 13.2929L13.2929 0.292893ZM2 14.4142V18H5.58579L17.5858 6L14 2.41421L2 14.4142Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default EditIcon;
