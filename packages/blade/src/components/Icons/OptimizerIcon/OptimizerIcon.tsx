import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _OptimizerIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 3C7 2.44772 6.55228 2 6 2C5.44772 2 5 2.44772 5 3V14.126C3.27477 14.5701 2 16.1362 2 18C2 20.2091 3.79086 22 6 22C7.8779 22 9.45354 20.7059 9.88384 18.9609C12.212 18.7544 14.4052 17.737 16.0711 16.0711C17.737 14.4052 18.7544 12.212 18.9609 9.88384C20.7059 9.45354 22 7.8779 22 6C22 3.79086 20.2091 2 18 2C15.7909 2 14 3.79086 14 6C14 7.84705 15.2519 9.4017 16.9535 9.86171C16.758 11.6666 15.9526 13.3611 14.6569 14.6569C13.3611 15.9526 11.6666 16.758 9.86171 16.9535C9.48769 15.57 8.39006 14.4838 7 14.126V3ZM8 18C8 16.8954 7.10457 16 6 16C4.89543 16 4 16.8954 4 18C4 19.1046 4.89543 20 6 20C7.10457 20 8 19.1046 8 18ZM18 8C19.1046 8 20 7.10457 20 6C20 4.89543 19.1046 4 18 4C16.8954 4 16 4.89543 16 6C16 7.10457 16.8954 8 18 8Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const OptimizerIcon = assignWithoutSideEffects(_OptimizerIcon, {
  componentId: 'OptimizerIcon',
});

export default OptimizerIcon;
