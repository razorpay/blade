import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PictureInPictureIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 19.75C3.2835 19.75 2.5 18.9665 2.5 18V6C2.5 5.0335 3.2835 4.25 4.25 4.25H20.75C21.7165 4.25 22.5 5.0335 22.5 6V18C22.5 18.9665 21.7165 19.75 20.75 19.75H4.25ZM4.5 17.75V6.25H20.5V11H14C13.5359 11 13.0908 11.1844 12.7626 11.5126C12.4344 11.8408 12.25 12.2859 12.25 12.75V17.75H4.5ZM20.5 13V17.75H14.25V13H20.5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PictureInPictureIcon = assignWithoutSideEffects(_PictureInPictureIcon, {
  componentId: 'PictureInPictureIcon',
});

export default PictureInPictureIcon;
