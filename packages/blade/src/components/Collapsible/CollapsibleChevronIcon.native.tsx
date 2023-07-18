import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import { useCollapsible } from './CollapsibleContext';
import {
  getCollapsibleChevronIconTransforms,
  getTransitionDuration,
  getTransitionEasing,
} from './commonStyles';
import { castNativeType } from '~utils';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon } from '~components/Icons';
import { useTheme } from '~components/BladeProvider';
import { makeAccessible } from '~utils/makeAccessible';

// Not really an IconComponent, a wrapper is needed for animating the icon inside
const CollapsibleChevronIcon: IconComponent = (props) => {
  const { isExpanded } = useCollapsible();
  const { theme } = useTheme();

  const { transformExpanded, transformCollapsed } = getCollapsibleChevronIconTransforms();
  const duration = castNativeType(getTransitionDuration(theme));
  const easing = castNativeType(getTransitionEasing(theme));

  const rotateZ = useDerivedValue(() =>
    withTiming(isExpanded ? transformExpanded : transformCollapsed, { duration, easing }),
  );
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotateZ.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyles} {...makeAccessible({ hidden: true })}>
      <ChevronDownIcon {...props} />
    </Animated.View>
  );
};

export { CollapsibleChevronIcon };
