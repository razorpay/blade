import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _UserXIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.5 2C5.73858 2 3.5 4.23858 3.5 7C3.5 9.76142 5.73858 12 8.5 12C11.2614 12 13.5 9.76142 13.5 7C13.5 4.23858 11.2614 2 8.5 2ZM5.5 7C5.5 5.34315 6.84315 4 8.5 4C10.1569 4 11.5 5.34315 11.5 7C11.5 8.65685 10.1569 10 8.5 10C6.84315 10 5.5 8.65685 5.5 7Z"
        fill={iconColor}
      />
      <Path
        d="M5 14C2.23858 14 0 16.2386 0 19V21C0 21.5523 0.447715 22 1 22C1.55228 22 2 21.5523 2 21V19C2 17.3431 3.34315 16 5 16H12C13.6569 16 15 17.3431 15 19V21C15 21.5523 15.4477 22 16 22C16.5523 22 17 21.5523 17 21V19C17 16.2386 14.7614 14 12 14H5Z"
        fill={iconColor}
      />
      <Path
        d="M17.2929 7.29289C17.6834 6.90237 18.3166 6.90237 18.7071 7.29289L20.5 9.08579L22.2929 7.29289C22.6834 6.90237 23.3166 6.90237 23.7071 7.29289C24.0976 7.68342 24.0976 8.31658 23.7071 8.70711L21.9142 10.5L23.7071 12.2929C24.0976 12.6834 24.0976 13.3166 23.7071 13.7071C23.3166 14.0976 22.6834 14.0976 22.2929 13.7071L20.5 11.9142L18.7071 13.7071C18.3166 14.0976 17.6834 14.0976 17.2929 13.7071C16.9024 13.3166 16.9024 12.6834 17.2929 12.2929L19.0858 10.5L17.2929 8.70711C16.9024 8.31658 16.9024 7.68342 17.2929 7.29289Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const UserXIcon = assignWithoutSideEffects(_UserXIcon, {
  componentId: 'UserXIcon',
});

export default UserXIcon;
