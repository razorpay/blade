import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ThumbsUpIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0862 1.59386C10.2467 1.23273 10.6048 1 11 1C13.2091 1 15 2.79086 15 5V8H19.6549C20.5328 7.99187 21.3703 8.36871 21.9465 9.03134C22.524 9.69553 22.7808 10.5798 22.6487 11.4501L21.2687 20.4499C21.2687 20.4502 21.2687 20.4497 21.2687 20.4499C21.0444 21.9266 19.7678 23.0139 18.2748 23H4C2.34315 23 1 21.6569 1 20V13C1 11.3431 2.34315 10 4 10H6.35013L10.0862 1.59386ZM6 12H4C3.44772 12 3 12.4477 3 13V20C3 20.5523 3.44772 21 4 21H6V12ZM8 21V11.2122L11.608 3.09411C12.4153 3.35143 13 4.10743 13 5V9C13 9.55228 13.4477 10 14 10H19.66L19.6713 9.99994C19.9647 9.99661 20.2447 10.1223 20.4373 10.3437C20.6297 10.565 20.7153 10.8596 20.6714 11.1495C20.6714 11.1497 20.6714 11.1494 20.6714 11.1495L19.2913 20.1501C19.2165 20.6431 18.7899 21.0057 18.2913 21.0001L8 21Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ThumbsUpIcon = assignWithoutSideEffects(_ThumbsUpIcon, {
  componentId: 'ThumbsUpIcon',
});

export default ThumbsUpIcon;
