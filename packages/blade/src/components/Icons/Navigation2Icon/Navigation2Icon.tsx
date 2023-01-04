import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const Navigation2Icon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C12.4189 2 12.7935 2.26117 12.9383 2.65429L19.9383 21.6543C20.0836 22.0487 19.9668 22.4918 19.646 22.7633C19.3251 23.0349 18.8688 23.0768 18.5038 22.8682L12 19.1518L5.49613 22.8682C5.1312 23.0768 4.67483 23.0349 4.354 22.7633C4.03316 22.4918 3.91634 22.0487 4.06165 21.6543L11.0616 2.65429C11.2065 2.26117 11.581 2 12 2ZM6.88737 19.7697L11.5038 17.1318C11.8113 16.9561 12.1887 16.9561 12.4961 17.1318L17.1126 19.7697L12 5.89264L6.88737 19.7697Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default Navigation2Icon;
