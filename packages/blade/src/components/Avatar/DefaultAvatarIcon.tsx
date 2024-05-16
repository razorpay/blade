import type { AvatarProps } from './types';
import { Svg, Path } from '~components/Icons/_Svg';
import type { IconProps } from '~components/Icons';
import useIconProps from '~components/Icons/useIconProps';

const iconPropsToSizeMap = {
  xsmall: {
    height: '14',
    width: '14',
  },
  small: {
    height: '20',
    width: '18',
  },
  medium: {
    height: '26',
    width: '22',
  },
  large: {
    height: '34',
    width: '30',
  },
  xlarge: {
    height: '40',
    width: '34',
  },
};

type DefaultAvatarIconProps = IconProps & {
  size?: AvatarProps['size'];
};

const DefaultAvatarIcon: React.ComponentType<DefaultAvatarIconProps> = ({
  color,
  size = 'xsmall',
  ...styledProps
}) => {
  const { iconColor } = useIconProps({ color });
  const height = iconPropsToSizeMap[size].height;
  const width = iconPropsToSizeMap[size].width;

  return (
    <Svg
      {...styledProps}
      width={width as string}
      height={height as string}
      viewBox={`0 0 ${iconPropsToSizeMap.xsmall.width} ${iconPropsToSizeMap.xsmall.height}`}
      fill="none"
    >
      <Path
        d="M0.928589 11.3881C1.55965 8.94407 3.72749 7.14289 6.3048 7.14289H7.69523C10.2725 7.14289 12.4404 8.94407 13.0714 11.3881C11.505 12.96 9.36258 13.9286 7.00002 13.9286C4.63745 13.9286 2.49507 12.96 0.928589 11.3881Z"
        fill={iconColor}
      />
      <Path
        d="M4.21915 3.21432C4.21915 1.63637 5.46417 0.357178 7.00002 0.357178C8.53587 0.357178 9.78088 1.63637 9.78088 3.21432C9.78088 4.79228 8.53587 6.07146 7.00002 6.07146C5.46417 6.07146 4.21915 4.79228 4.21915 3.21432Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export { DefaultAvatarIcon };
