import { useStepGroup } from './StepGroupContext';
import { getLineSpacings, iconSizeTokens } from './tokens';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import type { IconComponent } from '~components/Icons';
import type { IndicatorProps } from '~components/Indicator';
import { Indicator } from '~components/Indicator';
import { makeSize } from '~utils';

type LeadingBackgroundCircleProps = {
  color: IndicatorProps['color'];
  size: BaseBoxProps['width'];
  margin: BaseBoxProps['margin'];
  children: BaseBoxProps['children'];
};

const LeadingBackgroundCircle = ({
  color,
  size,
  margin,
  children,
}: LeadingBackgroundCircleProps): React.ReactElement => {
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
      zIndex={1}
      margin={margin}
    >
      {children}
    </BaseBox>
  );
};

const StepItemIndicator = ({ color }: { color: IndicatorProps['color'] }): React.ReactElement => {
  const { size } = useStepGroup();
  const spacingTokens = getLineSpacings(size);

  return (
    <LeadingBackgroundCircle
      color={color}
      size={makeSize(spacingTokens.markerBackgroundSize)}
      margin={makeSize(spacingTokens.markerMargin)}
    >
      <Indicator
        position="relative"
        marginLeft="4px"
        color={color}
        size={size}
        accessibilityLabel={`${color} indicator`}
      />
    </LeadingBackgroundCircle>
  );
};

type StepItemIconProps = {
  icon: IconComponent;
  color: IndicatorProps['color'];
};

const StepItemIcon = ({ icon: Icon, color = 'neutral' }: StepItemIconProps): React.ReactElement => {
  const { size } = useStepGroup();
  const spacingTokens = getLineSpacings(size);

  return (
    <LeadingBackgroundCircle
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
    </LeadingBackgroundCircle>
  );
};

export { StepItemIndicator, StepItemIcon };
