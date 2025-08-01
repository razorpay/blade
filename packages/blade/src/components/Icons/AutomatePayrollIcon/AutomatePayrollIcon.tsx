import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AutomatePayrollIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 4C5.44772 4 5 4.44772 5 5V11.4066C5.11468 11.4477 5.22873 11.4963 5.34164 11.5528L11.5528 14.6584C11.8343 14.7991 12.1657 14.7991 12.4472 14.6584L18.6584 11.5528C18.7713 11.4963 18.8853 11.4477 19 11.4066V5C19 4.44772 18.5523 4 18 4H6ZM21 11.4064V5C21 3.34315 19.6569 2 18 2H6C4.34315 2 3 3.34315 3 5V11.4064C1.86959 11.81 1 12.8786 1 14.2361V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V14.2361C23 12.8786 22.1304 11.81 21 11.4064ZM11.9923 5.30005C12.2551 5.29808 12.514 5.39981 12.7071 5.59294L15.1134 7.99919C15.5039 8.38972 15.5039 9.02288 15.1134 9.41341C14.7228 9.80393 14.0897 9.80393 13.6991 9.41341L13 8.71426V11.8C13 12.3523 12.5523 12.8 12 12.8C11.4477 12.8 11 12.3523 11 11.8V8.7045L10.2598 9.44466C9.86932 9.83518 9.23615 9.83518 8.84563 9.44466C8.4551 9.05413 8.4551 8.42097 8.84563 8.03044L11.2831 5.59294C11.4789 5.39715 11.7357 5.29952 11.9923 5.30005ZM4.44721 13.3416C3.78231 13.0092 3 13.4927 3 14.2361V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V14.2361C21 13.4927 20.2177 13.0092 19.5528 13.3416L13.3416 16.4472C12.4971 16.8695 11.5029 16.8695 10.6584 16.4472L4.44721 13.3416Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const AutomatePayrollIcon = assignWithoutSideEffects(_AutomatePayrollIcon, {
  componentId: 'AutomatePayrollIcon',
});

export default AutomatePayrollIcon;
