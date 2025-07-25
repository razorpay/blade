import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _EditComposeIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.7071 1.29289C18.3166 0.902369 17.6834 0.902369 17.2929 1.29289L7.29289 11.2929C7.10536 11.4804 7 11.7348 7 12V16C7 16.5523 7.44772 17 8 17H12C12.2652 17 12.5196 16.8946 12.7071 16.7071L22.7071 6.70711C23.0976 6.31658 23.0976 5.68342 22.7071 5.29289L18.7071 1.29289ZM9 15V12.4142L18 3.41421L20.5858 6L11.5858 15H9Z"
        fill={iconColor}
      />
      <Path
        d="M4 5C4 4.44772 4.44772 4 5 4H10.34C10.8923 4 11.34 3.55228 11.34 3C11.34 2.44772 10.8923 2 10.34 2H5C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H19C20.6569 22 22 20.6569 22 19V13.66C22 13.1077 21.5523 12.66 21 12.66C20.4477 12.66 20 13.1077 20 13.66V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const EditComposeIcon = assignWithoutSideEffects(_EditComposeIcon, {
  componentId: 'EditComposeIcon',
});

export default EditComposeIcon;
