import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ZoomInIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 7C11.5523 7 12 7.44772 12 8V10H14C14.5523 10 15 10.4477 15 11C15 11.5523 14.5523 12 14 12H12V14C12 14.5523 11.5523 15 11 15C10.4477 15 10 14.5523 10 14V12H8C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10H10V8C10 7.44772 10.4477 7 11 7Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C13.125 20 15.078 19.2635 16.6177 18.0319L20.2929 21.7071C20.6834 22.0977 21.3166 22.0977 21.7071 21.7071C22.0977 21.3166 22.0977 20.6834 21.7071 20.2929L18.0319 16.6177C19.2635 15.078 20 13.125 20 11C20 6.02944 15.9706 2 11 2ZM16.0412 15.8566C17.2541 14.5978 18 12.886 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C12.886 18 14.5978 17.2541 15.8566 16.0412C15.8828 16.0071 15.9116 15.9742 15.9429 15.9429C15.9742 15.9116 16.0071 15.8828 16.0412 15.8566Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ZoomInIcon = assignWithoutSideEffects(_ZoomInIcon, {
  componentId: 'ZoomInIcon',
});

export default ZoomInIcon;
