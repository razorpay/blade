import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PocketIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.70711 9.29289C8.31658 8.90237 7.68342 8.90237 7.29289 9.29289C6.90237 9.68342 6.90237 10.3166 7.29289 10.7071L11.2929 14.7071C11.6834 15.0976 12.3166 15.0976 12.7071 14.7071L16.7071 10.7071C17.0976 10.3166 17.0976 9.68342 16.7071 9.29289C16.3166 8.90237 15.6834 8.90237 15.2929 9.29289L12 12.5858L8.70711 9.29289Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 2C2.34315 2 1 3.34315 1 5V11C1 13.9174 2.15893 16.7153 4.22183 18.7782C6.28473 20.8411 9.08262 22 12 22C18.0751 22 23 17.0751 23 11V5C23 3.34315 21.6569 2 20 2H4ZM3 5C3 4.44772 3.44772 4 4 4H20C20.5523 4 21 4.44772 21 5V11C21 15.9706 16.9706 20 12 20C9.61305 20 7.32387 19.0518 5.63604 17.364C3.94821 15.6761 3 13.3869 3 11V5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PocketIcon = assignWithoutSideEffects(_PocketIcon, {
  componentId: 'PocketIcon',
});

export default PocketIcon;
