import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _RotateClockWiseIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.14125 4.99635C10.2617 3.27579 14.1439 3.82644 16.6627 6.34689C16.6699 6.35405 16.6771 6.36109 16.6845 6.36802L19.528 9H16C15.4477 9 15 9.44772 15 10C15 10.5523 15.4477 11 16 11H22C22.5523 11 23 10.5523 23 10V4C23 3.44772 22.5523 3 22 3C21.4477 3 21 3.44772 21 4V7.63742L18.0664 4.92215C14.9175 1.78097 10.0715 1.09674 6.17554 3.24495C2.27503 5.39565 0.267187 9.86684 1.25111 14.211C2.23504 18.5551 5.97351 21.7248 10.4201 21.9849C14.8666 22.245 18.9492 19.5329 20.4329 15.3331C20.6169 14.8124 20.3439 14.2411 19.8232 14.0571C19.3024 13.8731 18.7311 14.1462 18.5472 14.6669C17.3602 18.0267 14.0941 20.1964 10.5369 19.9883C6.97962 19.7802 3.98884 17.2445 3.2017 13.7692C2.41456 10.2939 4.02084 6.71691 7.14125 4.99635Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const RotateClockWiseIcon = assignWithoutSideEffects(_RotateClockWiseIcon, {
  componentId: 'RotateClockWiseIcon',
});

export default RotateClockWiseIcon;
