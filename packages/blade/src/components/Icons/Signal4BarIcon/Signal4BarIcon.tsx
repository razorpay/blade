import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _Signal4BarIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.42499 21.9999C4.12499 21.9999 3.87916 21.8999 3.68749 21.6999C3.49583 21.4999 3.39999 21.2666 3.39999 20.9999C3.39999 20.8666 3.42499 20.7416 3.47499 20.6249C3.52499 20.5082 3.59999 20.3999 3.69999 20.2999L20.3 3.6999C20.4 3.5999 20.5083 3.5249 20.625 3.4749C20.7417 3.4249 20.8667 3.3999 21 3.3999C21.2667 3.3999 21.5 3.49574 21.7 3.6874C21.9 3.87907 22 4.1249 22 4.4249V20.4999C22 20.9166 21.8542 21.2707 21.5625 21.5624C21.2708 21.8541 20.9167 21.9999 20.5 21.9999H4.42499Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const Signal4BarIcon = assignWithoutSideEffects(_Signal4BarIcon, {
  componentId: 'Signal4BarIcon',
});

export default Signal4BarIcon;
