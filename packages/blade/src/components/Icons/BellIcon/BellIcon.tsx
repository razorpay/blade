import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BellIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3C8.68629 3 6 5.68629 6 9V14C6 14.7286 5.80521 15.4117 5.46487 16H18.5351C18.1948 15.4117 18 14.7286 18 14V9C18 5.68629 15.3137 3 12 3ZM22 16C20.8954 16 20 15.1046 20 14V9C20 4.58172 16.4183 1 12 1C7.58172 1 4 4.58172 4 9V14C4 15.1046 3.10457 16 2 16C1.44772 16 1 16.4477 1 17C1 17.5523 1.44772 18 2 18H22C22.5523 18 23 17.5523 23 17C23 16.4477 22.5523 16 22 16ZM9.76823 20.135C10.246 19.8579 10.8579 20.0205 11.135 20.4982C11.3139 20.8066 11.6435 20.9965 12 20.9965C12.3565 20.9965 12.6861 20.8066 12.865 20.4982C13.1421 20.0205 13.754 19.8579 14.2318 20.135C14.7095 20.4121 14.8721 21.024 14.595 21.5018C14.0583 22.427 13.0696 22.9965 12 22.9965C10.9304 22.9965 9.9417 22.427 9.405 21.5018C9.12788 21.024 9.2905 20.4121 9.76823 20.135Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const BellIcon = assignWithoutSideEffects(_BellIcon, {
  componentId: 'BellIcon',
});

export default BellIcon;
