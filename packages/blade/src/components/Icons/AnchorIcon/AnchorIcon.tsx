import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AnchorIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 5C8 2.79086 9.79086 1 12 1C14.2091 1 16 2.79086 16 5C16 6.86384 14.7252 8.42994 13 8.87398V20.9451C17.1716 20.4839 20.4839 17.1716 20.9451 13H19C18.4477 13 18 12.5523 18 12C18 11.4477 18.4477 11 19 11H22C22.5523 11 23 11.4477 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 11.7348 1.10536 11.4804 1.29289 11.2929C1.48043 11.1054 1.73478 11 2 11H5C5.55228 11 6 11.4477 6 12C6 12.5523 5.55228 13 5 13H3.05493C3.51608 17.1716 6.82838 20.4839 11 20.9451V8.87398C9.27477 8.42994 8 6.86384 8 5ZM14 5C14 6.10457 13.1046 7 12 7C10.8954 7 10 6.10457 10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const AnchorIcon = assignWithoutSideEffects(_AnchorIcon, {
  componentId: 'AnchorIcon',
});

export default AnchorIcon;
