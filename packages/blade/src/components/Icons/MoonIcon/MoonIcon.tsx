import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _MoonIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0812 2.50904C12.2747 2.85242 12.2485 3.27745 12.0142 3.59442C10.2488 5.98281 10.4964 9.30338 12.5965 11.4035C14.6966 13.5036 18.0172 13.7513 20.4056 11.9859C20.7226 11.7516 21.1476 11.7253 21.491 11.9188C21.8344 12.1124 22.032 12.4895 21.9958 12.882C21.5095 18.144 17.013 22.1194 11.7311 21.9571C6.44914 21.7948 2.20521 17.5509 2.04291 12.269C1.88062 6.98701 5.85598 2.49054 11.118 2.00426C11.5105 1.96799 11.8877 2.16566 12.0812 2.50904ZM9.31564 4.43767C6.13445 5.587 3.93352 8.67806 4.04197 12.2075C4.17181 16.4331 7.56695 19.8282 11.7925 19.9581C15.322 20.0665 18.413 17.8656 19.5624 14.6844C16.7077 15.7179 13.4237 15.0591 11.1823 12.8177C8.94091 10.5763 8.2821 7.2923 9.31564 4.43767Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const MoonIcon = assignWithoutSideEffects(_MoonIcon, {
  componentId: 'MoonIcon',
});

export default MoonIcon;
