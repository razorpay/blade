import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _HistoryIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.94449 4.92103C9.09681 1.7837 13.9432 1.10497 17.8366 3.25728C21.7346 5.4121 23.7376 9.88509 22.7493 14.2279C21.761 18.5708 18.0197 21.7366 13.5732 21.9925C9.12665 22.2484 5.04683 19.5328 3.56683 15.332C3.38331 14.8111 3.65681 14.24 4.17771 14.0565C4.69861 13.873 5.26966 14.1465 5.45318 14.6674C6.63718 18.028 9.90104 20.2006 13.4583 19.9958C17.0155 19.7911 20.0085 17.2585 20.7992 13.7842C21.5898 10.3099 19.9874 6.73149 16.869 5.00764C13.7507 3.28378 9.86814 3.83003 7.34651 6.3474C7.33937 6.35453 7.33213 6.36154 7.32478 6.36845L4.47426 8.99969H8C8.55228 8.99969 9 9.44741 9 9.99969C9 10.552 8.55228 10.9997 8 10.9997H2C1.44772 10.9997 1 10.552 1 9.99969V3.99969C1 3.44741 1.44772 2.99969 2 2.99969C2.55228 2.99969 3 3.44741 3 3.99969V7.63888L5.94449 4.92103ZM12 5.99976C12.5523 5.99976 13 6.44747 13 6.99976V12.5855L15.7071 15.2926C16.0976 15.6832 16.0976 16.3163 15.7071 16.7069C15.3166 17.0974 14.6834 17.0974 14.2929 16.7069L11.2929 13.7069C11.1054 13.5193 11 13.265 11 12.9998V6.99976C11 6.44747 11.4477 5.99976 12 5.99976Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const HistoryIcon = assignWithoutSideEffects(_HistoryIcon, {
  componentId: 'HistoryIcon',
});

export default HistoryIcon;
