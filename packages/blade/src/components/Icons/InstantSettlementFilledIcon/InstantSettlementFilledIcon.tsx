import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _InstantSettlementFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.2121 0.0657512C15.6002 0.213254 15.8568 0.585281 15.8568 1.00051V9.77811H19.9996C20.3933 9.77811 20.7504 10.0091 20.9118 10.3683C21.0731 10.7274 21.0087 11.1478 20.7472 11.4422L9.8903 23.6642C9.61453 23.9746 9.17561 24.0823 8.78747 23.9348C8.39932 23.7873 8.14271 23.4153 8.14271 23.0001V14.2225H3.99994C3.60621 14.2225 3.24913 13.9914 3.08778 13.6323C2.92643 13.2731 2.99085 12.8527 3.25233 12.5584L14.1093 0.336402C14.385 0.0259658 14.8239 -0.0817511 15.2121 0.0657512Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const InstantSettlementFilledIcon = assignWithoutSideEffects(_InstantSettlementFilledIcon, {
  componentId: 'InstantSettlementFilledIcon',
});

export default InstantSettlementFilledIcon;
