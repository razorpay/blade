import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BillMeFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 1C19.1046 1 20 1.89543 20 3V21C20 22.1046 19.1046 23 18 23H6C4.89543 23 4 22.1046 4 21V3C4 1.89543 4.89543 1 6 1H18ZM12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18ZM8.75 10C8.33579 10 8 10.3358 8 10.75C8 11.1642 8.33579 11.5 8.75 11.5H11.25C11.6642 11.5 12 11.1642 12 10.75C12 10.3358 11.6642 10 11.25 10H8.75ZM8.72754 7.5C8.32588 7.5 8 7.82588 8 8.22754V8.27246C8 8.67412 8.32588 9 8.72754 9H15.25C15.6642 9 16 8.66421 16 8.25C16 7.83579 15.6642 7.5 15.25 7.5H8.72754ZM8.72754 5C8.32588 5 8 5.32588 8 5.72754V5.77246C8 6.17412 8.32588 6.5 8.72754 6.5H15.25C15.6642 6.5 16 6.16421 16 5.75C16 5.33579 15.6642 5 15.25 5H8.72754Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const BillMeFilledIcon = assignWithoutSideEffects(_BillMeFilledIcon, {
  componentId: 'BillMeFilledIcon',
});

export default BillMeFilledIcon;
