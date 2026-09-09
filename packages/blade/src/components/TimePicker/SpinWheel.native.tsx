import React from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { Text } from '~components/Typography';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import type { TestID } from '~utils/types';

/**
 * Wheel item geometry. `ITEM_HEIGHT` mirrors the web `StyledScrollItem` height,
 * `VISIBLE_ITEMS` keeps the wheel roughly the same overall height as the web
 * dropdown (~170px), and `SPACER` centers the first/last value under the
 * highlight band.
 */
const ITEM_HEIGHT = 34;
const VISIBLE_ITEMS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const SPACER = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2;
const WHEEL_WIDTH = 72;

export { ITEM_HEIGHT, VISIBLE_ITEMS, WHEEL_HEIGHT, SPACER, WHEEL_WIDTH };

/**
 * Native-only SpinWheel props.
 *
 * The shared `SpinWheelProps` in `types.ts` carries DOM-only members
 * (`scrollContainerRef: React.Ref<HTMLDivElement>`, `tabIndex`) so it is NOT
 * reused here. This local type keeps the value/selection contract while
 * dropping the web-only ref plumbing.
 */
type SpinWheelNativeProps = {
  values: (string | number)[];
  selectedValue: string | number;
  /**
   * Optional display value for visual positioning when different from
   * `selectedValue` (e.g. minute steps: typed "03" positions at "00" while the
   * form value stays "03").
   */
  displayValue?: string | number;
  onChange: (value: string | number, index: number) => void;
  activeIndex?: number | null;
  onActiveIndexChange?: (index: number | null) => void;
  label?: string;
} & TestID;

/**
 * Reusable native SpinWheel — a vertically scrollable column of values where
 * the value under the center highlight band is the selected one. Replaces the
 * web `scroll-snap` + `document.elementFromPoint` implementation with
 * `ScrollView` momentum snapping and `contentOffset.y` → index math.
 */
const SpinWheel = ({
  values,
  selectedValue,
  displayValue,
  onChange,
  activeIndex,
  onActiveIndexChange,
  label,
  testID,
}: SpinWheelNativeProps): React.ReactElement => {
  const scrollRef = React.useRef<ScrollView>(null);
  // Guards `onChange` from firing while we programmatically reposition the wheel
  // (mirrors the web `isProgrammaticScroll` ref). Prevents a typed/selected
  // value from being clobbered by the momentum handler after `scrollTo`.
  const isProgrammaticScroll = React.useRef(false);
  const programmaticTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMounted = React.useRef(false);

  // Visual positioning follows `displayValue` when present, otherwise the real
  // selected value.
  const positioningValue = displayValue ?? selectedValue;

  const scrollToIndex = React.useCallback((index: number, animated: boolean): void => {
    if (index < 0) return;
    isProgrammaticScroll.current = true;
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated });
    if (programmaticTimeoutRef.current) {
      clearTimeout(programmaticTimeoutRef.current);
    }
    programmaticTimeoutRef.current = setTimeout(
      () => {
        isProgrammaticScroll.current = false;
      },
      animated ? 350 : 50,
    );
  }, []);

  // Position the wheel whenever the positioning value (or the value set) changes.
  React.useEffect(() => {
    const positionIndex = values.findIndex((val) => String(val) === String(positioningValue));
    if (positionIndex >= 0) {
      scrollToIndex(positionIndex, hasMounted.current);
    }
    hasMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positioningValue, values]);

  React.useEffect(() => {
    return () => {
      if (programmaticTimeoutRef.current) {
        clearTimeout(programmaticTimeoutRef.current);
      }
    };
  }, []);

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, values.length - 1));
    onActiveIndexChange?.(clamped);
    if (isProgrammaticScroll.current) return;
    const nextValue = values[clamped];
    if (String(nextValue) === String(selectedValue)) return;
    onChange(nextValue, clamped);
  };

  const handleItemPress = (value: string | number, index: number): void => {
    scrollToIndex(index, true);
    onChange(value, index);
    onActiveIndexChange?.(index);
  };

  return (
    <View
      style={{
        width: WHEEL_WIDTH,
        height: WHEEL_HEIGHT,
        overflow: 'hidden',
      }}
      {...metaAttribute({ name: MetaConstants.TimePicker, testID })}
      {...makeAccessible({ label })}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        <View style={{ height: SPACER }} />
        {values.map((value, index) => {
          const isVisuallySelected =
            activeIndex === index || String(value) === String(positioningValue);
          return (
            <Pressable
              key={`${value}-${index}`}
              onPress={() => handleItemPress(value, index)}
              accessibilityRole="button"
              accessibilityState={{ selected: isVisuallySelected }}
              style={{
                height: ITEM_HEIGHT,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                variant="body"
                size={isVisuallySelected ? 'large' : 'medium'}
                weight={isVisuallySelected ? 'semibold' : 'regular'}
                color={
                  isVisuallySelected
                    ? 'interactive.text.gray.normal'
                    : 'interactive.text.gray.muted'
                }
                textAlign="center"
              >
                {String(value).padStart(2, '0')}
              </Text>
            </Pressable>
          );
        })}
        <View style={{ height: SPACER }} />
      </ScrollView>
    </View>
  );
};

export { SpinWheel };
export type { SpinWheelNativeProps };
