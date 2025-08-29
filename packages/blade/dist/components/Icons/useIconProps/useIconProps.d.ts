import { IconProps } from '..';
import { iconSizeMap } from './iconSizeMap';
declare function useIconProps({ size, color, }: IconProps): {
    height: `${typeof iconSizeMap[keyof typeof iconSizeMap]}px`;
    width: `${typeof iconSizeMap[keyof typeof iconSizeMap]}px`;
    iconColor: string;
};
export default useIconProps;
