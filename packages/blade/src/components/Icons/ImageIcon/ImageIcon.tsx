import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ImageIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 8.5C6 7.11929 7.11929 6 8.5 6C9.88071 6 11 7.11929 11 8.5C11 9.88071 9.88071 11 8.5 11C7.11929 11 6 9.88071 6 8.5ZM8.5 8C8.22386 8 8 8.22386 8 8.5C8 8.77614 8.22386 9 8.5 9C8.77614 9 9 8.77614 9 8.5C9 8.22386 8.77614 8 8.5 8Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V5ZM5 4C4.44772 4 4 4.44772 4 5V19C4 19.4288 4.2699 19.7946 4.64909 19.9367L15.2929 9.29289C15.6835 8.90237 16.3166 8.90237 16.7072 9.29289L20 12.5857V5C20 4.44772 19.5523 4 19 4H5ZM20 15.4142L16 11.4142L7.41422 20H19C19.5523 20 20 19.5523 20 19V15.4142Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ImageIcon = assignWithoutSideEffects(_ImageIcon, {
  componentId: 'ImageIcon',
});

export default ImageIcon;
