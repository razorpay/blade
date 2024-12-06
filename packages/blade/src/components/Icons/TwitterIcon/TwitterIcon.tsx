import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const TwitterIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.7399 4.67267C20.1114 4.26401 20.0813 3.63156 19.6727 3.26006C19.264 2.88856 18.6315 2.91868 18.26 3.32734L12.9643 9.15277L9.34366 3.46312C9.1601 3.17468 8.8419 3 8.5 3H4C3.63502 3 3.29903 3.19885 3.12339 3.51879C2.94776 3.83874 2.96039 4.22895 3.15634 4.53688L8.92273 13.5983L3.26006 19.8275C2.88856 20.2361 2.91868 20.8686 3.32734 21.2401C3.73601 21.6116 4.36846 21.5814 4.73996 21.1728L10.0357 15.3473L13.6563 21.0369C13.8399 21.3253 14.1581 21.5 14.5 21.5H19C19.365 21.5 19.701 21.3012 19.8766 20.9812C20.0522 20.6613 20.0396 20.271 19.8437 19.9631L14.0773 10.9017L19.7399 4.67267ZM11.9742 11.3222C11.9777 11.3278 11.9813 11.3334 11.9849 11.3389L17.1783 19.5H15.0489L5.82167 5H7.95105L11.9742 11.3222Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default TwitterIcon;
