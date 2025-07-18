import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _IndiaFlagIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 5.86364C1 4.28209 2.27682 3 3.85185 3H20.1481C21.7232 3 23 4.28209 23 5.86364V18.1364C23 19.7179 21.7232 21 20.1481 21H3.85185C2.27682 21 1 19.7179 1 18.1364V5.86364ZM21.3322 8.11364V5.86332C21.3322 5.2307 20.8214 4.71786 20.1914 4.71786L3.81366 4.71786C3.18364 4.71786 2.67292 5.2307 2.67292 5.86332L2.67292 8.11364H21.3322ZM2.67292 9.75V14.25H10.2357C9.57335 13.7256 9.14815 12.9127 9.14815 12C9.14815 11.0873 9.57335 10.2744 10.2357 9.75H2.67292ZM13.7643 9.75C14.4267 10.2744 14.8519 11.0873 14.8519 12C14.8519 12.9127 14.4267 13.7256 13.7643 14.25H21.3322V9.75H13.7643ZM21.3322 15.8864H2.67292L2.67292 18.136C2.67292 18.7687 3.18364 19.2815 3.81365 19.2815L20.1914 19.2815C20.8214 19.2815 21.3322 18.7687 21.3322 18.136V15.8864ZM12 10.7727C11.325 10.7727 10.7778 11.3222 10.7778 12C10.7778 12.6778 11.325 13.2273 12 13.2273C12.675 13.2273 13.2222 12.6778 13.2222 12C13.2222 11.3222 12.675 10.7727 12 10.7727Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const IndiaFlagIcon = assignWithoutSideEffects(_IndiaFlagIcon, {
  componentId: 'IndiaFlagIcon',
});

export default IndiaFlagIcon;
