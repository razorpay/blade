import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _HeadphonesIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12V13H18C16.3431 13 15 14.3431 15 16V19C15 20.6569 16.3431 22 18 22H19C20.6569 22 22 20.6569 22 19V12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12V19C2 20.6569 3.34315 22 5 22H6C7.65685 22 9 20.6569 9 19V16C9 14.3431 7.65685 13 6 13H4V12ZM4 15V19C4 19.5523 4.44772 20 5 20H6C6.55228 20 7 19.5523 7 19V16C7 15.4477 6.55228 15 6 15H4ZM20 15H18C17.4477 15 17 15.4477 17 16V19C17 19.5523 17.4477 20 18 20H19C19.5523 20 20 19.5523 20 19V15Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const HeadphonesIcon = assignWithoutSideEffects(_HeadphonesIcon, {
  componentId: 'HeadphonesIcon',
});

export default HeadphonesIcon;
