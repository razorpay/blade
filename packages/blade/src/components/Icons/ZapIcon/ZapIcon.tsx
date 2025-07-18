import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ZapIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.3982 1.08275C13.8054 1.25952 14.0473 1.68359 13.9923 2.12409L13.1328 9.00006H21C21.388 9.00006 21.741 9.22452 21.9056 9.5759C22.0702 9.92729 22.0166 10.3422 21.7682 10.6402L11.7682 22.6402C11.484 22.9813 11.009 23.0941 10.6018 22.9174C10.1946 22.7406 9.95266 22.3165 10.0077 21.876L10.8672 15.0001H3C2.61198 15.0001 2.25899 14.7756 2.09441 14.4242C1.92983 14.0728 1.98337 13.658 2.23178 13.3599L12.2318 1.35987C12.516 1.01884 12.991 0.905986 13.3982 1.08275ZM5.13504 13.0001H12C12.2868 13.0001 12.5598 13.1232 12.7497 13.3383C12.9395 13.5533 13.0279 13.8395 12.9923 14.1241L12.4153 18.7396L18.865 11.0001H12C11.7132 11.0001 11.4401 10.8769 11.2503 10.6619C11.0605 10.4468 10.9721 10.1606 11.0077 9.87602L11.5847 5.26051L5.13504 13.0001Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ZapIcon = assignWithoutSideEffects(_ZapIcon, {
  componentId: 'ZapIcon',
});

export default ZapIcon;
