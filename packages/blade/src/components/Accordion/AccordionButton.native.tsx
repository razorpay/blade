import type { ReactElement } from 'react';
import { useEffect } from 'react';
import type { PressableProps } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { StyledAccordionButton } from './StyledAccordionButton.native';
import type { AccordionButtonProps } from './types';
import { useAccordion } from './AccordionContext';
import { getBackgroundColor, getTransitionDuration, getTransitionEasing } from './commonStyles';
import { Heading } from '~components/Typography';
import {
  MetaConstants,
  assignWithoutSideEffects,
  castNativeType,
  makeAccessible,
  metaAttribute,
} from '~utils';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';
import { CollapsibleChevronIcon } from '~components/Collapsible/CollapsibleChevronIcon';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import type { IconProps } from '~components/Icons';

const _AccordionButton = ({ index, icon: Icon, children }: AccordionButtonProps): ReactElement => {
  const { onExpandChange, isExpanded, collapsibleBodyId } = useCollapsible();
  const { showNumberPrefix, expandedIndex } = useAccordion();
  const { theme } = useTheme();

  const toggleCollapse = (): void => onExpandChange(!isExpanded);
  const isItemExpanded = expandedIndex === index;

  const isPressed = useSharedValue(false);

  const duration = castNativeType(getTransitionDuration(theme));
  const easing = castNativeType(getTransitionEasing(theme));

  const activeBackgroundColor = useSharedValue(
    getBackgroundColor({ theme, isExpanded, isActive: true }),
  );
  const inActiveBackgroundColor = useSharedValue(
    getBackgroundColor({ theme, isExpanded, isActive: false }),
  );

  /**
   * `backgroundColor` is derived from `isExpanded` and pressed state.
   *
   * Since we can't directly access return values from JS functions (`getBackgroundColor`) on UI thread,
   * this effect updates the shared values for active / inactive states which are used by `animatedStyles`.
   */
  useEffect(() => {
    activeBackgroundColor.value = getBackgroundColor({ theme, isExpanded, isActive: true });
    inActiveBackgroundColor.value = getBackgroundColor({ theme, isExpanded, isActive: false });
  }, [isExpanded, activeBackgroundColor, inActiveBackgroundColor, theme]);

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      isPressed.value ? activeBackgroundColor.value : inActiveBackgroundColor.value,
      {
        duration,
        easing,
      },
    ),
  }));

  const _index =
    typeof index === 'number' && showNumberPrefix ? (
      <Heading size="small" marginRight="spacing.2">
        {index + 1}.
      </Heading>
    ) : null;

  const renderChildren: PressableProps['children'] = ({ pressed }) => {
    isPressed.value = pressed;

    const iconColor: IconProps['color'] = pressed
      ? 'surface.action.icon.focus.lowContrast'
      : 'surface.action.icon.default.lowContrast';

    const _icon = Icon && (
      <Icon size="medium" color={iconColor} marginRight="spacing.3" marginY="spacing.2" />
    );

    if (_index && _icon) {
      throw new Error(`[Blade: Accordion]: showNumberPrefix and icon shouldn't be used together`);
    }

    return (
      <BaseBox
        display="flex"
        flexDirection="row"
        flex={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <BaseBox
          display="flex"
          flexDirection="row"
          alignItems="flex-start"
          /**
           * The `marginRight` is slightly larger here than web and the design spec (`spacing.4`),
           * because otherwise lengthy text sometimes comes too close to the rotating chevron icon
           * which doesn't look perfect
           */
          marginRight="spacing.5"
          flexShrink={1}
        >
          {_index}
          {_icon}
          <Heading size="small">{children}</Heading>
        </BaseBox>
        <BaseBox>
          <CollapsibleChevronIcon color={iconColor} size="large" />
        </BaseBox>
      </BaseBox>
    );
  };

  return (
    <StyledAccordionButton
      isExpanded={isExpanded}
      onPress={toggleCollapse}
      style={animatedStyles}
      {...makeAccessible({ role: 'button' })}
      {...makeAccessible({ expanded: isItemExpanded, controls: collapsibleBodyId })}
      {...metaAttribute({ name: MetaConstants.AccordionButton })}
    >
      {renderChildren}
    </StyledAccordionButton>
  );
};

const AccordionButton = assignWithoutSideEffects(_AccordionButton, {
  componentId: MetaConstants.AccordionButton,
});

export { AccordionButton };
