import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const TagIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 2C1 1.44772 1.44772 1 2 1H12C12.2652 1 12.5196 1.10536 12.7071 1.29289L21.2992 9.885C22.4624 11.0551 22.4624 12.9449 21.2992 14.115L21.2971 14.1171L14.1275 21.2867C13.5648 21.8498 12.801 22.1666 12.005 22.1666C11.2089 22.1666 10.4454 21.8501 9.88271 21.2869L1.29331 12.7075C1.10552 12.5199 1 12.2654 1 12V2ZM3 3V11.5854L11.2967 19.8725L11.2975 19.8733C11.4851 20.0611 11.7396 20.1666 12.005 20.1666C12.2704 20.1666 12.5249 20.0611 12.7125 19.8733L19.8808 12.705L19.8817 12.7041C20.2682 12.3143 20.2682 11.6857 19.8817 11.2959L19.8808 11.295L11.5858 3H3Z"
        fill={iconColor}
      />
      <Path
        d="M10 8.5C10 9.32843 9.32843 10 8.5 10C7.67157 10 7 9.32843 7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default TagIcon;
