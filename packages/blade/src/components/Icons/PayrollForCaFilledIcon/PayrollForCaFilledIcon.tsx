import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PayrollForCaFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.20215 12.9092C7.00261 13.6076 7.19735 14.3595 7.71094 14.873L10.5879 17.75C11.3689 18.5309 12.635 18.531 13.416 17.75L16.293 14.873C16.8065 14.3595 17.0013 13.6075 16.8018 12.9092L15.042 6.75H18.0078C18.3943 6.75004 18.7725 6.86186 19.0967 7.07227L22.0889 9.01562C22.6569 9.38447 23 10.0161 23 10.6934V20.75C23 21.8546 22.1046 22.75 21 22.75H3C1.89543 22.75 1 21.8546 1 20.75V10.6934C1 10.0161 1.34311 9.38447 1.91113 9.01562L4.90332 7.07227C5.22746 6.86186 5.60574 6.75004 5.99219 6.75H8.96191L7.20215 12.9092Z"
        fill={iconColor}
      />
      <Path
        d="M14.8789 13.459L12.002 16.3359L9.125 13.459L10.7559 7.75H13.248L14.8789 13.459Z"
        fill={iconColor}
      />
      <Path
        d="M13.7188 1.25C15.0199 1.25001 15.9747 2.47306 15.6592 3.73535L15.0352 6.23242L15.04 6.25H8.95996L8.96484 6.23242L8.33984 3.73535C8.02436 2.47326 8.97943 1.25034 10.2803 1.25H13.7188Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PayrollForCaFilledIcon = assignWithoutSideEffects(_PayrollForCaFilledIcon, {
  componentId: 'PayrollForCaFilledIcon',
});

export default PayrollForCaFilledIcon;
