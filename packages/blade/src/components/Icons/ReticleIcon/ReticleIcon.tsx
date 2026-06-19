import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ReticleIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13.0254 23H10.9629V13.8789H13.0254V23ZM10.1211 13.0332H1V10.9707H10.1211V13.0332ZM23.001 13.0332H13.8799V10.9707H23.001V13.0332ZM13.0254 10.1211H10.9629V1H13.0254V10.1211Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ReticleIcon = assignWithoutSideEffects(_ReticleIcon, {
  componentId: 'ReticleIcon',
});

export default ReticleIcon;
