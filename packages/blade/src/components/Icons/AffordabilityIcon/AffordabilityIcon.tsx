import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AffordabilityIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 5C2.44772 5 2 5.44772 2 6V9H4C4.55228 9 5 9.44772 5 10C5 10.5523 4.55228 11 4 11H2V18C2 18.5523 2.44772 19 3 19H21C21.5523 19 22 18.5523 22 18V11H20C19.4477 11 19 10.5523 19 10C19 9.44772 19.4477 9 20 9H22V6C22 5.44771 21.5523 5 21 5H3ZM24 6C24 4.34315 22.6569 3 21 3H3C1.34315 3 0 4.34315 0 6V18C0 19.6569 1.34315 21 3 21H21C22.6569 21 24 19.6569 24 18V6ZM12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9ZM7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12ZM12.25 9.75C12.8023 9.75 13.25 10.1977 13.25 10.75V11.68C13.25 12.3682 12.8964 13.032 12.2713 13.3994L11.5178 13.8555C11.0453 14.1415 10.4305 13.9903 10.1445 13.5178C9.85853 13.0453 10.0097 12.4305 10.4822 12.1445L11.2422 11.6845L11.25 11.6799V10.75C11.25 10.1977 11.6977 9.75 12.25 9.75Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const AffordabilityIcon = assignWithoutSideEffects(_AffordabilityIcon, {
  componentId: 'AffordabilityIcon',
});

export default AffordabilityIcon;
