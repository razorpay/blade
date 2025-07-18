import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BookmarkIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 4C6.44772 4 6 4.44772 6 5V19.0568L11.4188 15.1863C11.7665 14.9379 12.2335 14.9379 12.5812 15.1863L18 19.0568V5C18 4.44772 17.5523 4 17 4H7ZM4 5C4 3.34315 5.34315 2 7 2H17C18.6569 2 20 3.34315 20 5V21C20 21.3746 19.7907 21.7178 19.4576 21.8892C19.1245 22.0606 18.7236 22.0315 18.4188 21.8137L12 17.2289L5.58124 21.8137C5.27642 22.0315 4.87549 22.0606 4.54242 21.8892C4.20935 21.7178 4 21.3746 4 21V5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const BookmarkIcon = assignWithoutSideEffects(_BookmarkIcon, {
  componentId: 'BookmarkIcon',
});

export default BookmarkIcon;
