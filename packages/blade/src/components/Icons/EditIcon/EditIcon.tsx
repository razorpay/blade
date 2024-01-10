import type { ReactElement } from 'react';
import { Svg, Path } from '../_Svg';
import type { IconProps } from '..';
import useIconProps from '../useIconProps';

const EditIcon = ({ size, color, ...styledProps }: IconProps): ReactElement => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.293 2.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-13 13A1 1 0 0 1 8 22H3a1 1 0 0 1-1-1v-5a1 1 0 0 1 .293-.707l13-13ZM4 16.414V20h3.586l12-12L16 4.414l-12 12Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default EditIcon;
