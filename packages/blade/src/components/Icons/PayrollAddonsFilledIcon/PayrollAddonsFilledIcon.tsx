import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PayrollAddonsFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 2C20.1046 2 21 2.89543 21 4V21.1787C21 22.1206 19.8169 22.5401 19.2236 21.8086L17.1875 19.2988C16.6386 18.6219 15.6121 18.6055 15.042 19.2646L13.3779 21.1885C12.7797 21.8801 11.7066 21.8801 11.1084 21.1885L9.54297 19.3779C8.9113 18.6476 7.78143 18.6388 7.13867 19.3594L4.74609 22.042C4.13458 22.7275 3 22.2946 3 21.376V4C3 2.89543 3.89543 2 5 2H9C7.78565 2.91221 7 4.36426 7 6C7 8.76142 9.23858 11 12 11C14.7614 11 17 8.76142 17 6C17 4.36426 16.2143 2.91221 15 2H19Z"
        fill={iconColor}
      />
      <Path
        d="M12.0029 4.21973C12.3631 4.21975 12.6552 4.51195 12.6553 4.87207V5.80664H13.6211L13.6885 5.81055C14.0172 5.84398 14.2733 6.12149 14.2734 6.45898C14.2733 6.79654 14.0172 7.07498 13.6885 7.1084L13.6211 7.11133H12.6553V8.12207C12.6552 8.48221 12.3631 8.77439 12.0029 8.77441C11.6428 8.77441 11.3506 8.48223 11.3506 8.12207V7.11133H10.3828C10.0227 7.11133 9.73058 6.81907 9.73047 6.45898C9.73064 6.09894 10.0227 5.80664 10.3828 5.80664H11.3506V4.87207C11.3506 4.51193 11.6428 4.21973 12.0029 4.21973Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PayrollAddonsFilledIcon = assignWithoutSideEffects(_PayrollAddonsFilledIcon, {
  componentId: 'PayrollAddonsFilledIcon',
});

export default PayrollAddonsFilledIcon;
