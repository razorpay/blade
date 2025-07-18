import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { Path, Svg } from '../_Svg';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _RotateCounterClockWiseIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} height={height} width={width} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.8366 3.25759C13.9432 1.10528 9.09681 1.784 5.94449 4.92134L3 7.63918V4C3 3.44772 2.55228 3 2 3C1.44772 3 1 3.44772 1 4V10C1 10.5523 1.44772 11 2 11H8C8.55228 11 9 10.5523 9 10C9 9.44772 8.55228 9 8 9H4.47426L7.32478 6.36875C7.33213 6.36185 7.33937 6.35483 7.34651 6.34771C9.86814 3.83034 13.7507 3.28409 16.869 5.00794C19.9874 6.7318 21.5898 10.3102 20.7992 13.7845C20.0085 17.2588 17.0155 19.7914 13.4583 19.9961C9.90104 20.2009 6.63718 18.0283 5.45318 14.6677C5.26966 14.1468 4.69861 13.8733 4.17771 14.0568C3.65681 14.2403 3.38331 14.8114 3.56683 15.3323C5.04683 19.5331 9.12665 22.2487 13.5732 21.9928C18.0197 21.7369 21.761 18.5711 22.7493 14.2283C23.7376 9.8854 21.7346 5.41241 17.8366 3.25759Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const RotateCounterClockWiseIcon = assignWithoutSideEffects(_RotateCounterClockWiseIcon, {
  componentId: 'RotateCounterClockWiseIcon',
});

export default RotateCounterClockWiseIcon;
