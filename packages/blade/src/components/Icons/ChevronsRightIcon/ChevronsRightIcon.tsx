import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ChevronsRightIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.70711 6.29289C6.31658 5.90237 5.68342 5.90237 5.29289 6.29289C4.90237 6.68342 4.90237 7.31658 5.29289 7.70711L9.58579 12L5.29289 16.2929C4.90237 16.6834 4.90237 17.3166 5.29289 17.7071C5.68342 18.0976 6.31658 18.0976 6.70711 17.7071L11.7071 12.7071C12.0976 12.3166 12.0976 11.6834 11.7071 11.2929L6.70711 6.29289Z"
        fill={iconColor}
      />
      <Path
        d="M13.7071 6.29289C13.3166 5.90237 12.6834 5.90237 12.2929 6.29289C11.9024 6.68342 11.9024 7.31658 12.2929 7.70711L16.5858 12L12.2929 16.2929C11.9024 16.6834 11.9024 17.3166 12.2929 17.7071C12.6834 18.0976 13.3166 18.0976 13.7071 17.7071L18.7071 12.7071C19.0976 12.3166 19.0976 11.6834 18.7071 11.2929L13.7071 6.29289Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ChevronsRightIcon;
