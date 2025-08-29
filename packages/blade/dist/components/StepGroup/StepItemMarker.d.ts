import { IconComponent } from '../Icons';
import { IndicatorProps } from '../Indicator';
declare const StepItemIndicator: ({ color }: {
    color: IndicatorProps['color'];
}) => React.ReactElement;
type StepItemIconProps = {
    icon: IconComponent;
    color: IndicatorProps['color'];
    isDisabled?: boolean;
};
declare const StepItemIcon: ({ icon: Icon, color, isDisabled, }: StepItemIconProps) => React.ReactElement;
export { StepItemIndicator, StepItemIcon };
