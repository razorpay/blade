import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _MoreIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM11.7929 8.29289C12.1834 7.90237 12.8166 7.90237 13.2071 8.29289L16.2071 11.2929C16.5976 11.6834 16.5976 12.3166 16.2071 12.7071L13.2071 15.7071C12.8166 16.0976 12.1834 16.0976 11.7929 15.7071C11.4024 15.3166 11.4024 14.6834 11.7929 14.2929L13.0858 13H8.5C7.94772 13 7.5 12.5523 7.5 12C7.5 11.4477 7.94772 11 8.5 11H13.0858L11.7929 9.70711C11.4024 9.31658 11.4024 8.68342 11.7929 8.29289Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const MoreIcon = assignWithoutSideEffects(_MoreIcon, {
  componentId: 'MoreIcon',
});

export default MoreIcon;
