import React from 'react';
import { Pressable, View } from 'react-native';
import type { QuickFilterProps, QuickFilterContentProps } from './types';
import { useQuickFilterGroupContext } from './QuickFilterGroup';
import { StyledQuickFilterWrapper } from './StyledQuickFilterWrapper';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Radio } from '~components/Radio';
import { Checkbox } from '~components/Checkbox';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';

const QuickFilterContent = ({
  value,
  title,
  trailing,
  selectionType = 'single',
  isSelected = false,
  ...rest
}: QuickFilterContentProps): React.ReactElement => {
  const isSingleSelection = selectionType === 'single';

  return (
    <Box
      display="flex"
      flexDirection="row"
      gap="spacing.3"
      justifyContent="center"
      alignItems="center"
      paddingY="spacing.3"
      paddingLeft={isSingleSelection ? 'spacing.4' : 'spacing.3'}
      paddingRight="spacing.4"
    >
      {/*
       * pointerEvents="none" prevents Radio/Checkbox from intercepting touch events.
       * The parent Pressable owns the entire tap target; Radio/Checkbox are visual only.
       * Without this, only the tiny checkbox/radio hitbox responds on native (no <label> equivalent).
       */}
      <View pointerEvents="none">
        <Box
          display="flex"
          flexDirection="row"
          gap={isSingleSelection ? 'spacing.0' : 'spacing.2'}
          justifyContent="center"
          alignItems="center"
        >
          {isSingleSelection ? (
            <Radio value={value} _hideRadioIcon {...makeAnalyticsAttribute(rest)} />
          ) : (
            <Checkbox value={value} {...makeAnalyticsAttribute(rest)} />
          )}
          {/*
           * On native, CSS Grid is not available.
           * The web uses an invisible bold clone to pre-reserve space so the container
           * doesn't shift width on selection. On native we always render semibold weight
           * so there is no layout shift (font-weight changes do not affect RN layout the
           * same way they do on web).
           */}
          <Text
            variant="body"
            size="medium"
            color={isSelected ? 'interactive.text.gray.normal' : 'interactive.text.gray.subtle'}
            weight={isSelected ? 'semibold' : 'medium'}
          >
            {title}
          </Text>
        </Box>
      </View>

      {trailing}
    </Box>
  );
};

const QuickFilter = React.forwardRef<BladeElementRef, QuickFilterProps>(
  ({ title, value, trailing, testID, ...rest }, _ref): React.ReactElement => {
    const { selectedQuickFilters, selectionType, onSelect } = useQuickFilterGroupContext();

    const isQuickFilterSelected = selectedQuickFilters.includes(value);

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ selected: isQuickFilterSelected }}
        onPress={() => onSelect(value)}
      >
        <StyledQuickFilterWrapper
          isSelected={isQuickFilterSelected}
          {...makeAnalyticsAttribute(rest)}
          {...metaAttribute({ testID })}
        >
          <QuickFilterContent
            value={value}
            title={title}
            trailing={trailing}
            selectionType={selectionType}
            isSelected={isQuickFilterSelected}
            {...rest}
          />
        </StyledQuickFilterWrapper>
      </Pressable>
    );
  },
);

QuickFilter.displayName = 'QuickFilter';

export { QuickFilter };
