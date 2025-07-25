import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _FacebookIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 7C8 3.68629 10.6863 1 14 1H17C17.5523 1 18 1.44772 18 2V6C18 6.55228 17.5523 7 17 7H14V9H17C17.3079 9 17.5987 9.14187 17.7882 9.38459C17.9777 9.6273 18.0448 9.94379 17.9701 10.2425L16.9701 14.2425C16.8589 14.6877 16.4589 15 16 15H14V22C14 22.5523 13.5523 23 13 23H9C8.44772 23 8 22.5523 8 22V15H6C5.44772 15 5 14.5523 5 14V10C5 9.44772 5.44772 9 6 9H8V7ZM14 3C11.7909 3 10 4.79086 10 7V10C10 10.5523 9.55228 11 9 11H7V13H9C9.55228 13 10 13.4477 10 14V21H12V14C12 13.4477 12.4477 13 13 13H15.2192L15.7192 11H13C12.4477 11 12 10.5523 12 10V7C12 5.89543 12.8954 5 14 5H16V3H14Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const FacebookIcon = assignWithoutSideEffects(_FacebookIcon, {
  componentId: 'FacebookIcon',
});

export default FacebookIcon;
