import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const SubscriptionsIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2929 0.292893C16.6834 -0.0976311 17.3166 -0.0976311 17.7071 0.292893L21.7071 4.29289C22.0976 4.68342 22.0976 5.31658 21.7071 5.70711C21.3166 6.09763 20.6834 6.09763 20.2929 5.70711L16.2929 1.70711C15.9024 1.31658 15.9024 0.683417 16.2929 0.292893Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 6C6.20435 6 5.44129 6.31607 4.87868 6.87868C4.31607 7.44129 4 8.20435 4 9V11C4 11.5523 3.55228 12 3 12C2.44772 12 2 11.5523 2 11V9C2 7.67392 2.52678 6.40215 3.46447 5.46447C4.40215 4.52678 5.67392 4 7 4H21C21.5523 4 22 4.44772 22 5C22 5.55228 21.5523 6 21 6H7Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.29289 18.2929C2.68342 17.9024 3.31658 17.9024 3.70711 18.2929L7.70711 22.2929C8.09763 22.6834 8.09763 23.3166 7.70711 23.7071C7.31658 24.0976 6.68342 24.0976 6.29289 23.7071L2.29289 19.7071C1.90237 19.3166 1.90237 18.6834 2.29289 18.2929Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21 12C21.5523 12 22 12.4477 22 13V15C22 16.3261 21.4732 17.5979 20.5355 18.5355C19.5979 19.4732 18.3261 20 17 20H3C2.44772 20 2 19.5523 2 19C2 18.4477 2.44772 18 3 18H17C17.7956 18 18.5587 17.6839 19.1213 17.1213C19.6839 16.5587 20 15.7956 20 15V13C20 12.4477 20.4477 12 21 12Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10ZM8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default SubscriptionsIcon;
