import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ZapIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.3982 1.08275C13.8054 1.25952 14.0474 1.68359 13.9923 2.12409L13.1328 9.00006H21C21.388 9.00006 21.741 9.22452 21.9056 9.5759C22.0702 9.92729 22.0166 10.3422 21.7682 10.6402L11.7682 22.6402C11.484 22.9813 11.009 23.0941 10.6018 22.9174C10.1946 22.7406 9.95267 22.3165 10.0077 21.876L10.8672 15.0001H3.00001C2.61199 15.0001 2.259 14.7756 2.09442 14.4242C1.92984 14.0728 1.98339 13.658 2.23179 13.3599L12.2318 1.35987C12.516 1.01884 12.991 0.905986 13.3982 1.08275ZM5.13505 13.0001H12C12.2868 13.0001 12.5599 13.1232 12.7497 13.3383C12.9395 13.5533 13.0279 13.8395 12.9923 14.1241L12.4154 18.7396L18.865 11.0001H12C11.7132 11.0001 11.4402 10.8769 11.2503 10.6619C11.0605 10.4468 10.9722 10.1606 11.0077 9.87602L11.5847 5.26051L5.13505 13.0001Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ZapIcon;
