import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PieChartIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C11.7348 1 11.4804 1.10536 11.2929 1.29289C11.1054 1.48043 11 1.73478 11 2V12C11 12.5523 11.4477 13 12 13H22C22.5523 13 23 12.5523 23 12C23 9.08262 21.8411 6.28473 19.7782 4.22183C17.7153 2.15893 14.9174 1 12 1ZM13 11V3.0557C15.019 3.28137 16.9135 4.18561 18.364 5.63604C19.8144 7.08647 20.7186 8.98098 20.9443 11H13Z"
        fill={iconColor}
      />
      <Path
        d="M8.39997 3.74656C8.90615 3.52567 9.13743 2.93625 8.91654 2.43007C8.69565 1.92388 8.10623 1.6926 7.60005 1.91349C3.06956 3.89052 0.414221 8.64678 1.10871 13.5408C1.8032 18.4349 5.67694 22.2646 10.5786 22.9032C15.4803 23.5417 20.2059 20.8323 22.131 16.2795C22.3461 15.7708 22.1082 15.1841 21.5995 14.969C21.0908 14.7539 20.5041 14.9919 20.289 15.5006C18.7138 19.2256 14.8474 21.4424 10.837 20.9199C6.82652 20.3975 3.65709 17.2641 3.08887 13.2598C2.52065 9.25562 4.6932 5.36413 8.39997 3.74656Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PieChartIcon = assignWithoutSideEffects(_PieChartIcon, {
  componentId: 'PieChartIcon',
});

export default PieChartIcon;
