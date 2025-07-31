import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PosFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
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
        d="M20 20.2007C19.9999 21.8435 18.5551 23.0005 17 23.0005H7C5.44492 23.0005 4.00011 21.8435 4 20.2007V14.7505H20V20.2007ZM9 18.2505C8.58579 18.2505 8.25 18.5863 8.25 19.0005C8.25 19.4147 8.58579 19.7505 9 19.7505H15L15.0771 19.7466C15.4551 19.708 15.75 19.3887 15.75 19.0005C15.75 18.6123 15.4551 18.293 15.0771 18.2544L15 18.2505H9Z"
        fill={iconColor}
      />
      <Path
        d="M17 3.00049C18.5551 3.00049 19.9999 4.1575 20 5.80029V13.2505H4V5.80029C4.00012 4.1575 5.44492 3.00049 7 3.00049H17Z"
        fill={iconColor}
      />
      <Path
        d="M19 0.000488281C19.5523 0.000488233 20 0.448204 20 1.00049C20 1.55277 19.5523 2.00049 19 2.00049H5C4.44772 2.00049 4 1.55277 4 1.00049C4 0.448204 4.44772 0.00048833 5 0.000488281H19Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PosFilledIcon = assignWithoutSideEffects(_PosFilledIcon, {
  componentId: 'PosFilledIcon',
});

export default PosFilledIcon;
