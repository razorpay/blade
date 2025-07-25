import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _VideoIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 4C1.34315 4 0 5.34315 0 7V17C0 18.6569 1.34315 20 3 20H14C15.6569 20 17 18.6569 17 17V13.9432L22.4188 17.8137C22.7236 18.0315 23.1245 18.0606 23.4576 17.8892C23.7907 17.7178 24 17.3746 24 17V7C24 6.62542 23.7907 6.28224 23.4576 6.11084C23.1245 5.93943 22.7236 5.96855 22.4188 6.18627L17 10.0568V7C17 5.34315 15.6569 4 14 4H3ZM15 7C15 6.44772 14.5523 6 14 6H3C2.44772 6 2 6.44772 2 7V17C2 17.5523 2.44772 18 3 18H14C14.5523 18 15 17.5523 15 17V7ZM22 15.0568L17.7205 12L22 8.94319V15.0568Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const VideoIcon = assignWithoutSideEffects(_VideoIcon, {
  componentId: 'VideoIcon',
});

export default VideoIcon;
