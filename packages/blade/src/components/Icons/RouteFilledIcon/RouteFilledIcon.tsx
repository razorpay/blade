import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _RouteFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 3.00049C0 1.89592 0.895431 1.00049 2 1.00049H7C8.10457 1.00049 9 1.89592 9 3.00049H12H15C15 1.89592 15.8954 1.00049 17 1.00049H22C23.1046 1.00049 24 1.89592 24 3.00049V5.00049C24 6.10506 23.1046 7.00049 22 7.00049H17C15.8954 7.00049 15 6.10506 15 5.00049H13V11.0005H15C15 9.89592 15.8954 9.00049 17 9.00049H22C23.1046 9.00049 24 9.89592 24 11.0005V13.0005C24 14.1051 23.1046 15.0005 22 15.0005H17C15.8954 15.0005 15 14.1051 15 13.0005H13V19.0005H15C15 17.8959 15.8954 17.0005 17 17.0005H22C23.1046 17.0005 24 17.8959 24 19.0005V21.0005C24 22.1051 23.1046 23.0005 22 23.0005H17C15.8954 23.0005 15 22.1051 15 21.0005H12C11.9655 21.0005 11.9314 20.9987 11.8978 20.9953C11.3935 20.9441 11 20.5183 11 20.0005V19.9991L11 12.0014V11.9995V5.00049H9C9 6.10506 8.10457 7.00049 7 7.00049H2C0.89543 7.00049 0 6.10506 0 5.00049V3.00049Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const RouteFilledIcon = assignWithoutSideEffects(_RouteFilledIcon, {
  componentId: 'RouteFilledIcon',
});

export default RouteFilledIcon;
