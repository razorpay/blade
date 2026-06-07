import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { Pressable } from 'react-native';
import { useCollapsible } from './CollapsibleContext';
import { CollapsibleChevronIcon } from './CollapsibleChevronIcon';
import { componentIds } from './componentIds';
import type { CollapsibleTextProps } from './types';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const _CollapsibleText = ({
  children,
  size = 'medium',
  weight = 'regular',
  color,
  isDisabled,
  testID,
  accessibilityLabel,
  ...rest
}: CollapsibleTextProps): ReactElement => {
  const { onExpandChange, isExpanded, collapsibleBodyId } = useCollapsible();

  const toggleIsExpanded = useCallback(() => {
    if (!isDisabled) {
      onExpandChange(!isExpanded);
    }
  }, [onExpandChange, isExpanded, isDisabled]);

  return (
    <Pressable
      onPress={toggleIsExpanded}
      disabled={isDisabled}
      {...makeAccessible({
        role: 'button',
        label: accessibilityLabel,
        controls: collapsibleBodyId,
        expanded: isExpanded,
        disabled: isDisabled,
      })}
      {...metaAttribute({ name: MetaConstants.CollapsibleText, testID })}
    >
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        opacity={isDisabled ? 0.4 : 1}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
      >
        <Text size={size} weight={weight} color={color}>
          {children}
        </Text>
        <CollapsibleChevronIcon size="medium" color="currentColor" />
      </BaseBox>
    </Pressable>
  );
};

const CollapsibleText = assignWithoutSideEffects(_CollapsibleText, {
  componentId: componentIds.CollapsibleText,
});

export type { CollapsibleTextProps };
export { CollapsibleText };
