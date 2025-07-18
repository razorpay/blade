import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PayrollForCaIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.34049 3.48507C8.02492 2.22278 8.97963 1 10.2808 1H13.7192C15.0204 1 15.9751 2.22278 15.6595 3.48507L15.0351 5.98275L16.7999 12.1595C16.9994 12.8579 16.8046 13.6096 16.291 14.1232L13.4142 17C12.6332 17.781 11.3668 17.781 10.5858 17L7.70896 14.1232C7.19536 13.6096 7.00058 12.8579 7.20012 12.1595L8.96491 5.98275L8.34049 3.48507ZM13.7192 3H10.2808L10.7808 5L13.2192 5L13.7192 3ZM13.2457 7L10.7543 7L9.12317 12.709L12 15.5858L14.8768 12.709L13.2457 7ZM6.848 7.47C7.14071 7.93834 6.99834 8.55529 6.53 8.848L3.47 10.7605C3.17762 10.9432 3 11.2637 3 11.6085V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V11.6085C21 11.2637 20.8224 10.9432 20.53 10.7605L17.47 8.848C17.0017 8.55529 16.8593 7.93834 17.152 7.47C17.4447 7.00166 18.0617 6.85929 18.53 7.152L21.59 9.0645C22.4671 9.61272 23 10.5741 23 11.6085V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V11.6085C1 10.5741 1.53286 9.61272 2.41 9.0645L5.47 7.152C5.93834 6.85929 6.55529 7.00166 6.848 7.47Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PayrollForCaIcon = assignWithoutSideEffects(_PayrollForCaIcon, {
  componentId: 'PayrollForCaIcon',
});

export default PayrollForCaIcon;
