import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AffordabilityFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.7607 9.8833C13.1664 9.88334 13.495 10.212 13.4951 10.6177V11.7563C13.4951 12.4317 13.1483 13.0783 12.54 13.437L12.541 13.438L11.6104 14.0015L11.5439 14.0366C11.2075 14.1962 10.7986 14.0788 10.6016 13.7534C10.3915 13.4064 10.5027 12.9548 10.8496 12.7446L11.7803 12.1812L11.792 12.1743L11.8438 12.1401C11.9573 12.0518 12.0264 11.9117 12.0264 11.7563V10.6177C12.0265 10.212 12.355 9.8833 12.7607 9.8833Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21 3.00049C22.6569 3.00049 24 4.34363 24 6.00049V9.00049H20.75C20.3358 9.00049 20 9.33627 20 9.75049C20 10.1647 20.3358 10.5005 20.75 10.5005H24V18.0005C24 19.6573 22.6569 21.0005 21 21.0005H3C1.34315 21.0005 0 19.6573 0 18.0005V10.5005H3.25C3.66421 10.5005 4 10.1647 4 9.75049C4 9.33627 3.66421 9.00049 3.25 9.00049H0V6.00049C0 4.34363 1.34315 3.00049 3 3.00049H21ZM12 7.00049C9.22518 7.00056 7.00009 9.2527 7 12.0005C7.00026 14.7481 9.22529 17.0004 12 17.0005C14.7747 17.0004 16.9997 14.7481 17 12.0005C16.9999 9.25274 14.7748 7.00062 12 7.00049Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const AffordabilityFilledIcon = assignWithoutSideEffects(_AffordabilityFilledIcon, {
  componentId: 'AffordabilityFilledIcon',
});

export default AffordabilityFilledIcon;
