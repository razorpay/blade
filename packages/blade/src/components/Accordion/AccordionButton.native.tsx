import type { ReactElement } from 'react';
import { useEffect } from 'react';
import type { PressableProps } from 'react-native';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { StyledAccordionButton } from './StyledAccordionButton.native';
import type { AccordionButtonProps } from './types';
import { useAccordion } from './AccordionContext';
import { getBackgroundColor, getTransitionDuration, getTransitionEasing } from './commonStyles';
import { AccordionItemHeader } from './AccordionItemHeader';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { castNativeType } from '~utils';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { makeAccessible } from '~utils/makeAccessible';
import { throwBladeError } from '~utils/logger';

const _AccordionButton = ({
  index,
  icon: Icon,
  title,
  isDeprecatedAPI,
  isDisabled,
  header,
}: AccordionButtonProps): ReactElement => {
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

  const _showNumberPrefix = typeof index === 'number' && showNumberPrefix;

  const _index = _showNumberPrefix ? (
    <Text size="large" weight="semibold" marginRight="spacing.2">
      {index + 1}.
    </Text>
  ) : null;

  const a11yLabel = _showNumberPrefix ? `${index + 1}. ${title}` : title;

  const renderChildren: PressableProps['children'] = ({ pressed }) => {
    isPressed.value = pressed;

    const _icon = Icon && (
      <Icon
        size="medium"
        color="surface.icon.gray.normal"
        marginRight="spacing.3"
        marginY="spacing.2"
      />
    );

    if (__DEV__) {
      if (_index && _icon) {
        throwBladeError({
          message: "showNumberPrefix and icon shouldn't be used together",
          moduleName: 'Accordion',
        });
      }
    }

    return (
      <BaseBox
        display="flex"
        flexDirection="row"
        flex={1}
        justifyContent="space-between"
        alignItems="center"
      >
        {isDeprecatedAPI ? <AccordionItemHeader title={title} leading={_icon ?? _index} /> : header}
      </BaseBox>
    );
  };

  return (
    <StyledAccordionButton
      isExpanded={isExpanded}
      onPress={toggleCollapse}
      style={animatedStyles}
      disabled={isDisabled}
      {...makeAccessible({
        role: 'button',
        expanded: isItemExpanded,
        controls: collapsibleBodyId,
        label: a11yLabel,
      })}
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
