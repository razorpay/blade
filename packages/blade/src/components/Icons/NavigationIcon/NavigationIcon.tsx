import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _NavigationIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.7071 2.29292C22.0059 2.59175 22.0846 3.04618 21.9037 3.42811L12.9037 22.4281C12.7229 22.8098 12.3218 23.0368 11.9015 22.9952C11.4811 22.9535 11.1323 22.6523 11.0299 22.2426L9.17537 14.8246L1.75746 12.9702C1.3477 12.8677 1.04648 12.5189 1.00486 12.0986C0.963241 11.6782 1.19019 11.2771 1.57191 11.0963L20.5719 2.09629C20.9538 1.91538 21.4083 1.99409 21.7071 2.29292ZM4.95334 11.7076L10.2425 13.0299C10.6008 13.1195 10.8806 13.3992 10.9701 13.7575L12.2924 19.0467L18.8976 5.10241L4.95334 11.7076Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const NavigationIcon = assignWithoutSideEffects(_NavigationIcon, {
  componentId: 'NavigationIcon',
});

export default NavigationIcon;
