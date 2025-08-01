import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _CoinsIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 4C10.58 4 7 7.58 7 12C7 16.42 10.58 20 15 20C19.42 20 23 16.42 23 12C23 7.58 19.42 4 15 4ZM15 18C11.69 18 9 15.31 9 12C9 8.69 11.69 6 15 6C18.31 6 21 8.69 21 12C21 15.31 18.31 18 15 18ZM3 12C3 9.61 4.4 7.54 6.43 6.58C6.77 6.42 7 6.11 7 5.74V5.55C7 4.87 6.29 4.44 5.68 4.73C2.92 5.99 1 8.77 1 12C1 15.23 2.92 18.01 5.68 19.27C6.29 19.55 7 19.13 7 18.45V18.27C7 17.9 6.77 17.58 6.43 17.42C4.4 16.46 3 14.39 3 12Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const CoinsIcon = assignWithoutSideEffects(_CoinsIcon, {
  componentId: 'CoinsIcon',
});

export default CoinsIcon;
