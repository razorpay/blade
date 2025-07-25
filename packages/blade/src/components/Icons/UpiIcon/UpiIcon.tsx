import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _UpiIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.62351 3.00002C6.93911 2.99687 6.34704 3.47588 6.20725 4.14587L3.03088 19.3689C2.84464 20.2615 3.52431 21.1002 4.43609 21.1031L5.0262 21.1049C5.39218 21.106 5.74487 20.9677 6.01257 20.7182L9.72559 17.2566L9.30317 19.3867C9.12621 20.279 9.81071 21.1098 10.7204 21.1068L10.9498 21.1061C11.2947 21.1049 11.6277 20.9801 11.8883 20.7541L19.7601 13.9295C20.2769 13.4815 20.4072 12.7318 20.072 12.1356L15.3483 3.73538C15.0933 3.28187 14.6134 3.0012 14.0931 3.0012H13.8573C13.1806 3.0012 12.5952 3.47234 12.4506 4.13337L11.6352 7.85928L8.90663 3.65627C8.64235 3.24919 8.19079 3.00262 7.70545 3.00039L7.62351 3.00002ZM12.2282 12.2986L7.86864 5.58345L5.07629 18.9661L12.2282 12.2986ZM13.1052 10.1235L14.0579 11.5909C14.4384 12.1771 14.3431 12.9518 13.832 13.4283L12.1269 15.0179L11.4113 18.6266L18.2065 12.7353L14.1228 5.47325L13.1052 10.1235Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const UpiIcon = assignWithoutSideEffects(_UpiIcon, {
  componentId: 'UpiIcon',
});

export default UpiIcon;
