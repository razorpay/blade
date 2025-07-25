import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _CastIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.00001 5C3.44773 5 3.00001 5.44772 3.00001 6V8C3.00001 8.55228 2.5523 9 2.00001 9C1.44773 9 1.00001 8.55228 1.00001 8V6C1.00001 4.34315 2.34316 3 4.00001 3H20C21.6569 3 23 4.34315 23 6V18C23 19.6569 21.6569 21 20 21H14C13.4477 21 13 20.5523 13 20C13 19.4477 13.4477 19 14 19H20C20.5523 19 21 18.5523 21 18V6C21 5.44772 20.5523 5 20 5H4.00001ZM1.00614 11.9395C1.06719 11.3906 1.56165 10.9951 2.11055 11.0561C6.75817 11.573 10.427 15.2418 10.9439 19.8895C11.0049 20.4384 10.6095 20.9328 10.0606 20.9939C9.51165 21.0549 9.01719 20.6594 8.95614 20.1105C8.54261 16.3924 5.60757 13.4574 1.88948 13.0439C1.34057 12.9828 0.945093 12.4884 1.00614 11.9395ZM1.02018 15.9002C1.13055 15.359 1.6587 15.0098 2.19984 15.1202C4.55699 15.6009 6.39912 17.443 6.87984 19.8002C6.99021 20.3413 6.64099 20.8695 6.09984 20.9798C5.5587 21.0902 5.03055 20.741 4.92018 20.1998C4.5997 18.6284 3.37161 17.4003 1.80018 17.0798C1.25904 16.9695 0.90982 16.4413 1.02018 15.9002Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const CastIcon = assignWithoutSideEffects(_CastIcon, {
  componentId: 'CastIcon',
});

export default CastIcon;
