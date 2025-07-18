import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ViewLiveDemoIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 4C1 2.34315 2.34315 1 4 1H20C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H14.5C13.9477 23 13.5 22.5523 13.5 22C13.5 21.4477 13.9477 21 14.5 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V9.5C3 10.0523 2.55228 10.5 2 10.5C1.44772 10.5 1 10.0523 1 9.5V4ZM13 5.97998C13 5.4277 13.4477 4.97998 14 4.97998H18.01C18.2752 4.97998 18.5296 5.08535 18.7171 5.27289C18.9047 5.46044 19.01 5.71481 19.01 5.98004L19.0098 9.99004C19.0097 10.5423 18.562 10.99 18.0097 10.99C17.4574 10.9899 17.0097 10.5422 17.0098 9.98992L17.0099 8.39774L13.7078 11.7064C13.3177 12.0973 12.6845 12.0979 12.2936 11.7078C11.9027 11.3177 11.9021 10.6845 12.2922 10.2936L15.5992 6.97998H14C13.4477 6.97998 13 6.53227 13 5.97998ZM1 15C1 13.3431 2.34315 12 4 12H9C10.6569 12 12 13.3431 12 15V20C12 21.6569 10.6569 23 9 23H4C2.34315 23 1 21.6569 1 20V15ZM4 14C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V15C10 14.4477 9.55228 14 9 14H4Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ViewLiveDemoIcon = assignWithoutSideEffects(_ViewLiveDemoIcon, {
  componentId: 'ViewLiveDemoIcon',
});

export default ViewLiveDemoIcon;
