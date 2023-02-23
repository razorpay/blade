import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const CrosshairIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 20.9451V18C13 17.4477 12.5523 17 12 17C11.4477 17 11 17.4477 11 18V20.9451C6.82838 20.4839 3.51608 17.1716 3.05493 13H6C6.55228 13 7 12.5523 7 12C7 11.4477 6.55228 11 6 11H3.05493C3.51608 6.82838 6.82838 3.51608 11 3.05493V6C11 6.55228 11.4477 7 12 7C12.5523 7 13 6.55228 13 6V3.05493C17.1716 3.51608 20.4839 6.82838 20.9451 11H18C17.4477 11 17 11.4477 17 12C17 12.5523 17.4477 13 18 13H20.9451C20.4839 17.1716 17.1716 20.4839 13 20.9451Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default CrosshairIcon;
