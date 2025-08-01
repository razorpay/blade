import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BoxIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.665 0.554619C11.506 0.136742 12.4941 0.136742 13.335 0.554619L13.3373 0.55572L21.335 4.55462L21.3364 4.5553C22.3551 5.06215 22.9994 6.10172 23 7.23962V16.7701C22.9994 17.9082 22.355 18.9484 21.3361 19.4552L21.335 19.4557L13.3375 23.4544C12.4925 23.8773 11.4976 23.8773 10.6525 23.4544L2.65284 19.4546L2.65007 19.4532C1.6327 18.9406 0.993567 17.896 1.00005 16.757V7.24016C1.00004 5.76057 1.97168 4.88844 2.55883 4.60273L10.665 0.554619ZM11.555 2.34568L4.23661 6.0004L12 9.88212L19.759 6.00265L12.445 2.34568L12.4441 2.34523C12.1643 2.20651 11.8349 2.20691 11.555 2.34568ZM3.00005 16.7671V7.61819L11.0001 11.6182V21.3921L3.54921 17.6667C3.21018 17.4955 2.99741 17.147 3.00005 16.7671ZM13.0001 21.3871L20.4428 17.6657L20.445 17.6646C20.7849 17.4958 20.9998 17.1491 21 16.7696V7.61818L13.0001 11.6182V21.3871Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const BoxIcon = assignWithoutSideEffects(_BoxIcon, {
  componentId: 'BoxIcon',
});

export default BoxIcon;
