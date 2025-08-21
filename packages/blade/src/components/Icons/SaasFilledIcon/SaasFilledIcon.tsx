import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _SaasFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.2739 3.37744C15.3684 3.3777 17.9221 6.03396 17.9221 9.36756C17.9221 9.55193 17.914 9.73469 17.8987 9.91475C17.7992 11.0776 17.3865 12.1432 16.7522 13.0168L16.6233 13.1889C16.3157 13.5826 16.3769 14.1579 16.761 14.4734C17.1212 14.7689 17.6375 14.7312 17.9543 14.4013L18.0149 14.3313C18.763 13.3751 19.2985 12.2284 19.548 10.9731C21.6446 11.3435 23.2734 13.2726 23.2734 15.6428C23.2732 18.2831 21.2515 20.3774 18.8137 20.3774H6.3279C3.56208 20.3772 1.27388 18.0021 1.27344 15.0155C1.27344 12.2052 3.30215 9.93328 5.84452 9.67766L6.08475 9.65966C6.16504 9.65564 6.24654 9.65366 6.3279 9.65366C7.38915 9.65371 8.37403 9.99972 9.1891 10.595L9.35023 10.717L9.42444 10.7711C9.80787 11.016 10.3184 10.9277 10.6011 10.554C10.8837 10.18 10.8386 9.65257 10.5113 9.33354L10.442 9.27252L10.2242 9.10646C9.24368 8.39058 8.07381 7.93667 6.80932 7.84402C7.44724 5.25928 9.66857 3.37766 12.2739 3.37744Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const SaasFilledIcon = assignWithoutSideEffects(_SaasFilledIcon, {
  componentId: 'SaasFilledIcon',
});

export default SaasFilledIcon;
