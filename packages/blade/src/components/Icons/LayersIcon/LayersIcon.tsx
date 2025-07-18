import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _LayersIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5528 1.10557C11.8343 0.964809 12.1657 0.964809 12.4472 1.10557L22.4472 6.10557C22.786 6.27496 23 6.62123 23 7C23 7.37877 22.786 7.72504 22.4472 7.89443L12.4472 12.8944C12.1657 13.0352 11.8343 13.0352 11.5528 12.8944L1.55279 7.89443C1.214 7.72504 1 7.37877 1 7C1 6.62123 1.214 6.27496 1.55279 6.10557L11.5528 1.10557ZM4.23607 7L12 10.882L19.7639 7L12 3.11803L4.23607 7Z"
        fill={iconColor}
      />
      <Path
        d="M1.10555 16.5528C1.35254 16.0588 1.95321 15.8586 2.44719 16.1055L12 20.8819L21.5528 16.1055C22.0467 15.8586 22.6474 16.0588 22.8944 16.5528C23.1414 17.0467 22.9412 17.6474 22.4472 17.8944L12.4472 22.8944C12.1657 23.0352 11.8343 23.0352 11.5528 22.8944L1.55276 17.8944C1.05878 17.6474 0.858558 17.0467 1.10555 16.5528Z"
        fill={iconColor}
      />
      <Path
        d="M2.44719 11.1055C1.95321 10.8586 1.35254 11.0588 1.10555 11.5528C0.858558 12.0467 1.05878 12.6474 1.55276 12.8944L11.5528 17.8944C11.8343 18.0352 12.1657 18.0352 12.4472 17.8944L22.4472 12.8944C22.9412 12.6474 23.1414 12.0467 22.8944 11.5528C22.6474 11.0588 22.0467 10.8586 21.5528 11.1055L12 15.8819L2.44719 11.1055Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const LayersIcon = assignWithoutSideEffects(_LayersIcon, {
  componentId: 'LayersIcon',
});

export default LayersIcon;
