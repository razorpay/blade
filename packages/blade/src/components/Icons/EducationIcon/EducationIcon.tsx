import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _EducationIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.9433 1.47962C11.5902 1.07711 12.4096 1.07711 13.0565 1.47962L21.1126 6.4923C21.5553 6.76773 21.8415 7.17173 21.9727 7.61379C22.0224 7.73261 22.0499 7.86307 22.0499 7.99996V8.03226C22.0581 8.13712 22.0581 8.2425 22.0499 8.34732L22.0499 14C22.0499 14.5522 21.6022 15 21.0499 15C20.4977 15 20.0499 14.5522 20.0499 14L20.0499 10.5038L19.4999 10.8215V17.7203C19.4999 18.8904 18.8196 19.9538 17.7571 20.4442L13.2571 22.5211C12.4594 22.8893 11.5405 22.8893 10.7428 22.5211L6.24277 20.4442C5.18032 19.9538 4.49994 18.8904 4.49994 17.7203V10.8215L2.9433 9.92214C1.63573 9.16666 1.60507 7.2901 2.88725 6.4923L10.9433 1.47962ZM6.49994 11.9771V17.7203C6.49994 18.1103 6.72673 18.4648 7.08088 18.6283L11.5809 20.7052C11.8468 20.8279 12.1531 20.8279 12.419 20.7052L16.919 18.6283C17.2732 18.4648 17.4999 18.1103 17.4999 17.7203V11.9771L13.0005 14.5768C12.3814 14.9345 11.6185 14.9345 10.9994 14.5768L6.49994 11.9771ZM20.0499 8.18662V8.19393L11.9999 12.845L3.94385 8.19041L11.9999 3.17773L20.0499 8.18662Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const EducationIcon = assignWithoutSideEffects(_EducationIcon, {
  componentId: 'EducationIcon',
});

export default EducationIcon;
