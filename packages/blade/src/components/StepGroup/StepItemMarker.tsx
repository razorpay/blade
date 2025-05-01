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
  isDisabled: boolean;
};

const MarkerBackgroundCircle = ({
  color,
  size,
  margin,
  children,
  isDisabled,
}: MarkerBackgroundCircleProps): React.ReactElement => {
  return (
    <BaseBox
      backgroundColor={
        isDisabled
          ? 'feedback.background.neutral.subtle'
          : color === 'primary'
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

const StepItemIndicator = ({
  color,
  isDisabled = false,
}: {
  color: IndicatorProps['color'];
  isDisabled?: boolean;
}): React.ReactElement => {
  const { size } = useStepGroup();
  const spacingTokens = getMarkerLineSpacings(size);

  return (
    <MarkerBackgroundCircle
      color={color}
      size={makeSize(spacingTokens.markerBackgroundSize)}
      margin={makeSize(spacingTokens.markerMargin)}
      isDisabled={isDisabled}
    >
      <Indicator
        position="relative"
        color={color}
        size={size}
        accessibilityLabel={`${color} indicator`}
        isDisabled={isDisabled}
      />
    </MarkerBackgroundCircle>
  );
};

type StepItemIconProps = {
  icon: IconComponent;
  color: IndicatorProps['color'];
  isDisabled?: boolean;
};

const StepItemIcon = ({
  icon: Icon,
  color = 'neutral',
  isDisabled = false,
}: StepItemIconProps): React.ReactElement => {
  const { size } = useStepGroup();
  const spacingTokens = getMarkerLineSpacings(size);

  return (
    <MarkerBackgroundCircle
      color={color}
      size={makeSize(spacingTokens.markerBackgroundSize)}
      margin={makeSize(spacingTokens.markerMargin)}
      isDisabled={isDisabled}
    >
      <Icon
        size={iconSizeTokens[size]}
        color={
          isDisabled
            ? 'surface.icon.gray.disabled'
            : color === 'primary'
            ? 'surface.icon.primary.normal'
            : `feedback.icon.${color}.intense`
        }
      />
    </MarkerBackgroundCircle>
  );
};

export { StepItemIndicator, StepItemIcon };
