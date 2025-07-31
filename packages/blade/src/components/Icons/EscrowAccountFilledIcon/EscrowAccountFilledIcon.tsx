import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _EscrowAccountFilledIcon: IconComponent = ({
  size,
  color,
  ...styledProps
}) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg
      {...styledProps}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 1C19.6569 1 21 2.34315 21 4V20C21 21.6569 19.6569 23 18 23H6C4.34315 23 3 21.6569 3 20V4C3 2.34315 4.34315 1 6 1H6.25V6.1582C6.25034 7.10675 7.2658 7.70915 8.09863 7.25488L9.75 6.35449L11.4014 7.25488C12.2342 7.70915 13.2497 7.10675 13.25 6.1582V1H18ZM8 16C7.44772 16 7 16.4477 7 17C7 17.5523 7.44772 18 8 18H13C13.5523 18 14 17.5523 14 17C14 16.4477 13.5523 16 13 16H8Z"
        fill={iconColor}
      />
      <Path
        d="M11.75 1V5.73633L10.3486 4.97266L10.2051 4.90527C9.91263 4.79093 9.58737 4.79093 9.29492 4.90527L9.15137 4.97266L7.75 5.73633V1H11.75Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const EscrowAccountFilledIcon = assignWithoutSideEffects(
  _EscrowAccountFilledIcon,
  {
    componentId: 'EscrowAccountFilledIcon',
  }
);

export default EscrowAccountFilledIcon;
