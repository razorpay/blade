import React from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { useTourContext } from '../TourContext';

type TourScrollableFrameProps = {
  children: React.ReactNode;
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  content: {
    paddingBottom: 48,
  },
});

/**
 * Native-only story helper: RN Storybook's StoryView is flex:1 + overflow:hidden
 * (no document scroll). Wrap long tour demos in a ScrollView and register it so
 * SpotlightPopoverTour can scrollStepIntoView like web scrollIntoView.
 */
const TourScrollableFrame = ({ children }: TourScrollableFrameProps): React.ReactElement => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const { registerScrollParent } = useTourContext();

  const register = React.useCallback(() => {
    const node = scrollViewRef.current;
    if (!node) return;
    registerScrollParent?.(node);
  }, [registerScrollParent]);

  React.useLayoutEffect(() => {
    register();
  }, [register]);

  const windowHeight = Dimensions.get('window').height;
  // Bound height so ScrollView scrolls inside StoryView (overflow:hidden, no document scroll)
  const maxHeight = Math.max(320, windowHeight - 220);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={[styles.scroll, { maxHeight }]}
      contentContainerStyle={styles.content}
      scrollEventThrottle={16}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      onLayout={register}
      onContentSizeChange={register}
      onScroll={(event) => {
        const node = scrollViewRef.current as
          | (ScrollView & { __bladeTourContentOffset?: { x: number; y: number } })
          | null;
        if (node) {
          node.__bladeTourContentOffset = event.nativeEvent.contentOffset;
        }
      }}
    >
      {children}
    </ScrollView>
  );
};

export { TourScrollableFrame };
