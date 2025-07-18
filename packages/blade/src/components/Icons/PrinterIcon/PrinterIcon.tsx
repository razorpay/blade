import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PrinterIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 2C5 1.44772 5.44772 1 6 1H18C18.5523 1 19 1.44772 19 2V8H20C21.6569 8 23 9.34315 23 11V16C23 17.6569 21.6569 19 20 19H19V22C19 22.5523 18.5523 23 18 23H6C5.44772 23 5 22.5523 5 22V19H4C2.34315 19 1 17.6569 1 16V11C1 9.34315 2.34315 8 4 8H5V2ZM7 18V21H17V18V15H7V18ZM19 17V14C19 13.4477 18.5523 13 18 13H6C5.44772 13 5 13.4477 5 14V17H4C3.44772 17 3 16.5523 3 16V11C3 10.4477 3.44772 10 4 10H6H18H20C20.5523 10 21 10.4477 21 11V16C21 16.5523 20.5523 17 20 17H19ZM17 3V8H7V3H17Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PrinterIcon = assignWithoutSideEffects(_PrinterIcon, {
  componentId: 'PrinterIcon',
});

export default PrinterIcon;
