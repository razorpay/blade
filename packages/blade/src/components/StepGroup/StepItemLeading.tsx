import BaseBox from '~components/Box/BaseBox';
import type { IndicatorProps } from '~components/Indicator';
import { Indicator } from '~components/Indicator';

const StepItemIndicator = ({ color }: { color: IndicatorProps['color'] }): React.ReactElement => {
  return (
    <BaseBox
      backgroundColor={`feedback.background.${color}.subtle`}
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="24px"
      width="24px"
      borderRadius="round"
      zIndex={1}
      margin="2px"
    >
      <Indicator
        position="relative"
        marginLeft="4px"
        color={color}
        size="large"
        accessibilityLabel={`${color} indicator`}
      />
    </BaseBox>
  );
};

export { StepItemIndicator };
