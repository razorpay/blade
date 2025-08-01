import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _HashIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.1104 2.0062C10.6593 2.06719 11.0548 2.56161 10.9938 3.11052L10.4506 8.00006H14.4383L15.0061 2.88966C15.0671 2.34075 15.5615 1.94521 16.1104 2.0062C16.6593 2.06719 17.0548 2.56161 16.9938 3.11052L16.4506 8.00006H20C20.5523 8.00006 21 8.44778 21 9.00006C21 9.55235 20.5523 10.0001 20 10.0001H16.2283L15.7839 14.0001H20C20.5523 14.0001 21 14.4478 21 15.0001C21 15.5523 20.5523 16.0001 20 16.0001H15.5617L14.9938 21.1105C14.9329 21.6594 14.4384 22.055 13.8895 21.994C13.3406 21.933 12.9451 21.4386 13.0061 20.8897L13.5494 16.0001H9.56168L8.99385 21.1105C8.93286 21.6594 8.43844 22.055 7.88953 21.994C7.34063 21.933 6.94509 21.4386 7.00608 20.8897L7.54937 16.0001H4C3.44772 16.0001 3 15.5523 3 15.0001C3 14.4478 3.44772 14.0001 4 14.0001H7.77159L8.21604 10.0001H4C3.44772 10.0001 3 9.55235 3 9.00006C3 8.44778 3.44772 8.00006 4 8.00006H8.43826L9.00608 2.88966C9.06707 2.34075 9.56149 1.94521 10.1104 2.0062ZM13.7716 14.0001L14.216 10.0001H10.2283L9.7839 14.0001H13.7716Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const HashIcon = assignWithoutSideEffects(_HashIcon, {
  componentId: 'HashIcon',
});

export default HashIcon;
