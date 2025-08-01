import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PowerIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2C13 1.44772 12.5523 1 12 1C11.4477 1 11 1.44772 11 2V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V2Z"
        fill={iconColor}
      />
      <Path
        d="M6.33722 7.34701C6.72768 6.95642 6.72757 6.32325 6.33699 5.93279C5.9464 5.54233 5.31323 5.54244 4.92277 5.93302C1.01847 9.8386 1.01916 16.1697 4.92431 20.0744C8.82947 23.9791 15.1605 23.9791 19.0657 20.0744C22.9708 16.1697 22.9715 9.8386 19.0672 5.93302C18.6768 5.54244 18.0436 5.54233 17.653 5.93279C17.2624 6.32325 17.2623 6.95642 17.6528 7.34701C20.7762 10.4715 20.7757 15.5363 17.6515 18.6601C14.5274 21.7839 9.46257 21.7839 6.33845 18.6601C3.21432 15.5363 3.21377 10.4715 6.33722 7.34701Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PowerIcon = assignWithoutSideEffects(_PowerIcon, {
  componentId: 'PowerIcon',
});

export default PowerIcon;
