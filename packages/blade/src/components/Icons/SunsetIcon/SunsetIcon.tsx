import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _SunsetIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 17C6 13.6863 8.68629 11 12 11C15.3137 11 18 13.6863 18 17C18 17.5523 17.5523 18 17 18C16.4477 18 16 17.5523 16 17C16 14.7909 14.2091 13 12 13C9.79086 13 8 14.7909 8 17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C12.5523 0 13 0.447715 13 1V8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8V1C11 0.447715 11.4477 0 12 0Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.51289 8.51289C3.90342 8.12237 4.53658 8.12237 4.92711 8.51289L6.34711 9.93289C6.73763 10.3234 6.73763 10.9566 6.34711 11.3471C5.95658 11.7376 5.32342 11.7376 4.93289 11.3471L3.51289 9.92711C3.12237 9.53658 3.12237 8.90342 3.51289 8.51289Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 17C0 16.4477 0.447715 16 1 16H3C3.55228 16 4 16.4477 4 17C4 17.5523 3.55228 18 3 18H1C0.447715 18 0 17.5523 0 17Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 17C20 16.4477 20.4477 16 21 16H23C23.5523 16 24 16.4477 24 17C24 17.5523 23.5523 18 23 18H21C20.4477 18 20 17.5523 20 17Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.4871 8.51289C20.8776 8.90342 20.8776 9.53658 20.4871 9.92711L19.0671 11.3471C18.6766 11.7376 18.0434 11.7376 17.6529 11.3471C17.2624 10.9566 17.2624 10.3234 17.6529 9.93289L19.0729 8.51289C19.4634 8.12237 20.0966 8.12237 20.4871 8.51289Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 21C0 20.4477 0.447715 20 1 20H23C23.5523 20 24 20.4477 24 21C24 21.5523 23.5523 22 23 22H1C0.447715 22 0 21.5523 0 21Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.29289 3.29289C7.68342 2.90237 8.31658 2.90237 8.70711 3.29289L12 6.58579L15.2929 3.29289C15.6834 2.90237 16.3166 2.90237 16.7071 3.29289C17.0976 3.68342 17.0976 4.31658 16.7071 4.70711L12.7071 8.70711C12.3166 9.09763 11.6834 9.09763 11.2929 8.70711L7.29289 4.70711C6.90237 4.31658 6.90237 3.68342 7.29289 3.29289Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const SunsetIcon = assignWithoutSideEffects(_SunsetIcon, {
  componentId: 'SunsetIcon',
});

export default SunsetIcon;
