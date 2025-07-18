import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _RazorpayxPayrollIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 3C5.44772 3 5 3.44772 5 4V11.4066C5.11468 11.4477 5.22873 11.4963 5.34164 11.5528L11.5528 14.6584C11.8343 14.7991 12.1657 14.7991 12.4472 14.6584L18.6584 11.5528C18.7713 11.4963 18.8853 11.4477 19 11.4066V4C19 3.44772 18.5523 3 18 3H6ZM21 11.4064V4C21 2.34315 19.6569 1 18 1H6C4.34315 1 3 2.34315 3 4V11.4064C1.86959 11.81 1 12.8786 1 14.2361V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V14.2361C23 12.8786 22.1304 11.81 21 11.4064ZM8 6.22998C8 5.6777 8.44772 5.22998 9 5.22998H15C15.5523 5.22998 16 5.6777 16 6.22998C16 6.78227 15.5523 7.22998 15 7.22998H9C8.44772 7.22998 8 6.78227 8 6.22998ZM9 10C9 9.44772 9.44772 9 10 9H14C14.5523 9 15 9.44772 15 10C15 10.5523 14.5523 11 14 11H10C9.44772 11 9 10.5523 9 10ZM4.44721 13.3416C3.78231 13.0092 3 13.4927 3 14.2361V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V14.2361C21 13.4927 20.2177 13.0092 19.5528 13.3416L13.3416 16.4472C12.4971 16.8695 11.5029 16.8695 10.6584 16.4472L4.44721 13.3416Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const RazorpayxPayrollIcon = assignWithoutSideEffects(_RazorpayxPayrollIcon, {
  componentId: 'RazorpayxPayrollIcon',
});

export default RazorpayxPayrollIcon;
