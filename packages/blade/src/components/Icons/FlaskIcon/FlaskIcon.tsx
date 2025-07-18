import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _FlaskIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.50024 4H9.00025V9.01733L3.24969 18.5992C3.09029 18.8646 3.00418 19.1677 3.00016 19.4773C2.99614 19.7871 3.07444 20.0924 3.22705 20.362C3.37966 20.6316 3.60111 20.8559 3.86878 21.0119C4.13636 21.1679 4.44085 21.25 4.75056 21.25H19.7512C20.0608 21.2497 20.3648 21.1673 20.6322 21.0111C20.8996 20.8549 21.1207 20.6306 21.273 20.3611C21.4254 20.0915 21.5035 19.7863 21.4994 19.4767C21.4953 19.1671 21.4091 18.8642 21.2496 18.5988L15.5002 9.01737V4H16.0002C16.5525 4 17.0002 3.55228 17.0002 3C17.0002 2.44772 16.5525 2 16.0002 2H8.50024C7.94796 2 7.50024 2.44772 7.50024 3C7.50024 3.55228 7.94796 4 8.50024 4ZM11.0002 9.29437V4H13.5002V9.29437C13.5002 9.47563 13.5495 9.65348 13.6428 9.80891L17.0363 15.4642C16.0214 15.5851 14.5849 15.4364 12.702 14.483C11.2168 13.7316 9.90548 13.3801 8.77413 13.2807L10.8577 9.80897C10.951 9.65353 11.0002 9.47566 11.0002 9.29437ZM7.57785 15.274L5.19162 19.25H19.308L18.1323 17.2907C16.6446 17.6706 14.5183 17.6444 11.7988 16.2674C9.96949 15.3419 8.57037 15.1786 7.57785 15.274Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const FlaskIcon = assignWithoutSideEffects(_FlaskIcon, {
  componentId: 'FlaskIcon',
});

export default FlaskIcon;
