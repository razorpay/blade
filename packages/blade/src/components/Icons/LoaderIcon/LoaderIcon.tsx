import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _LoaderIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2C13 1.44772 12.5523 1 12 1C11.4477 1 11 1.44772 11 2V6C11 6.55228 11.4477 7 12 7C12.5523 7 13 6.55228 13 6V2Z"
        fill={iconColor}
      />
      <Path
        d="M13 18C13 17.4477 12.5523 17 12 17C11.4477 17 11 17.4477 11 18V22C11 22.5523 11.4477 23 12 23C12.5523 23 13 22.5523 13 22V18Z"
        fill={iconColor}
      />
      <Path
        d="M4.22289 4.22289C4.61341 3.83236 5.24658 3.83236 5.6371 4.22289L8.4671 7.05289C8.85762 7.44341 8.85762 8.07658 8.4671 8.4671C8.07658 8.85762 7.44341 8.85762 7.05289 8.4671L4.22289 5.6371C3.83236 5.24658 3.83236 4.61341 4.22289 4.22289Z"
        fill={iconColor}
      />
      <Path
        d="M16.9471 15.5329C16.5566 15.1424 15.9234 15.1424 15.5329 15.5329C15.1424 15.9234 15.1424 16.5566 15.5329 16.9471L18.3629 19.7771C18.7534 20.1676 19.3866 20.1676 19.7771 19.7771C20.1676 19.3866 20.1676 18.7534 19.7771 18.3629L16.9471 15.5329Z"
        fill={iconColor}
      />
      <Path
        d="M1 12C1 11.4477 1.44772 11 2 11H6C6.55228 11 7 11.4477 7 12C7 12.5523 6.55228 13 6 13H2C1.44772 13 1 12.5523 1 12Z"
        fill={iconColor}
      />
      <Path
        d="M18 11C17.4477 11 17 11.4477 17 12C17 12.5523 17.4477 13 18 13H22C22.5523 13 23 12.5523 23 12C23 11.4477 22.5523 11 22 11H18Z"
        fill={iconColor}
      />
      <Path
        d="M8.4671 15.5329C8.85762 15.9234 8.85762 16.5566 8.4671 16.9471L5.6371 19.7771C5.24658 20.1676 4.61341 20.1676 4.22289 19.7771C3.83236 19.3866 3.83236 18.7534 4.22289 18.3629L7.05289 15.5329C7.44341 15.1424 8.07658 15.1424 8.4671 15.5329Z"
        fill={iconColor}
      />
      <Path
        d="M19.7771 5.6371C20.1676 5.24658 20.1676 4.61341 19.7771 4.22289C19.3866 3.83236 18.7534 3.83236 18.3629 4.22289L15.5329 7.05289C15.1424 7.44341 15.1424 8.07658 15.5329 8.4671C15.9234 8.85762 16.5566 8.85762 16.9471 8.4671L19.7771 5.6371Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const LoaderIcon = assignWithoutSideEffects(_LoaderIcon, {
  componentId: 'LoaderIcon',
});

export default LoaderIcon;
