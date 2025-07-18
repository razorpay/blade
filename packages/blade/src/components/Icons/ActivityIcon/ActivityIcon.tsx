import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ActivityIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1C9.43043 1 9.81257 1.27543 9.94868 1.68377L15 16.8377L17.0513 10.6838C17.1874 10.2754 17.5696 10 18 10H22C22.5523 10 23 10.4477 23 11C23 11.5523 22.5523 12 22 12H18.7208L15.9487 20.3162C15.8126 20.7246 15.4304 21 15 21C14.5696 21 14.1874 20.7246 14.0513 20.3162L9 5.16228L6.94868 11.3162C6.81257 11.7246 6.43043 12 6 12H2C1.44772 12 1 11.5523 1 11C1 10.4477 1.44772 10 2 10H5.27924L8.05132 1.68377C8.18743 1.27543 8.56957 1 9 1Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ActivityIcon = assignWithoutSideEffects(_ActivityIcon, {
  componentId: 'ActivityIcon',
});

export default ActivityIcon;
