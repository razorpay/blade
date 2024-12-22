import { useStepGroup } from './StepGroupContext';
import { getMarkerLineSpacings, iconSizeTokens } from './tokens';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import type { IndicatorProps } from '~components/Indicator';
import { Indicator } from '~components/Indicator';
import { makeSize } from '~utils';

type MarkerBackgroundCircleProps = {
  color: IndicatorProps['color'];
  size: BaseBoxProps['width'];
  margin: BaseBoxProps['margin'];
  children: BaseBoxProps['children'];
};

const MarkerBackgroundCircle = ({
  color,
  size,
  margin,
  children,
}: MarkerBackgroundCircleProps): React.ReactElement => {
  return (
    <BaseBox
      backgroundColor={
        color === 'primary'
          ? 'surface.background.primary.subtle'
          : `feedback.background.${color}.subtle`
      }
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={size}
      width={size}
      borderRadius="round"
      margin={margin}
    >
      {children}
    </BaseBox>
  );
};

const StepItemIndicator = ({ color }: { color: IndicatorProps['color'] }): React.ReactElement => {
  const { size } = useStepGroup();
  const spacingTokens = getMarkerLineSpacings(size);

  return (
    <MarkerBackgroundCircle
      color={color}
      size={makeSize(spacingTokens.markerBackgroundSize)}
      margin={makeSize(spacingTokens.markerMargin)}
    >
      <Indicator
        position="relative"
        color={color}
        size={size}
        accessibilityLabel={`${color} indicator`}
      />
    </MarkerBackgroundCircle>
  );
};

type StepItemIconProps = {
  icon: IconComponent;
  color: IndicatorProps['color'];
};

const StepItemIcon = ({ icon: Icon, color = 'neutral' }: StepItemIconProps): React.ReactElement => {
  const { size } = useStepGroup();
  const spacingTokens = getMarkerLineSpacings(size);

  return (
    <MarkerBackgroundCircle
      color={color}
      size={makeSize(spacingTokens.markerBackgroundSize)}
      margin={makeSize(spacingTokens.markerMargin)}
    >
      <Icon
        size={iconSizeTokens[size]}
        color={
          color === 'primary' ? 'surface.icon.primary.normal' : `feedback.icon.${color}.intense`
        }
      />
    </MarkerBackgroundCircle>
  );
};

export { StepItemIndicator, StepItemIcon };
