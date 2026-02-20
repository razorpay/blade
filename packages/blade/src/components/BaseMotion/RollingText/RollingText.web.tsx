import React from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { castWebType } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { BaseMotionBox } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { Box } from '~components/Box';

const ShimmerOverlay = (): React.ReactElement => {
  const { theme } = useTheme();

  const shimmerColor = theme.colors.surface.text.staticWhite.muted;
  const shimmerDuration = msToSeconds(theme.motion.duration['2xgentle']);
  const shimmerDelay = msToSeconds(theme.motion.delay.gentle);
  const shimmerEase = cssBezierToArray(castWebType(theme.motion.easing.standard));

  return (
    <m.span
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
        pointerEvents: 'none',
      }}
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{
        duration: shimmerDuration,
        ease: shimmerEase,
        repeat: Infinity,
        repeatDelay: shimmerDelay,
      }}
    />
  );
};

type RollingTextProps = {
  /** Array of strings to cycle through with a rolling animation */
  texts: string[];
  /** Custom render function for each text item */
  children?: (text: string) => React.ReactNode;
  /** Callback fired when the active index changes */
  onIndexChange?: (index: number) => void;
  /** Cycle interval in ms (defaults to theme.motion.delay.xlong) */
  cycleDuration?: number;
  /** Whether to show the shimmer overlay on each item (defaults to true) */
  showShimmer?: boolean;
};

const RollingText = ({
  texts,
  children,
  onIndexChange,
  cycleDuration: cycleDurationProp,
  showShimmer = true,
}: RollingTextProps): React.ReactElement => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const cycleDuration = cycleDurationProp ?? theme.motion.delay.xlong;
  const slideDuration = msToSeconds(theme.motion.duration.xmoderate);
  const slideEase = cssBezierToArray(castWebType(theme.motion.easing.emphasized));

  React.useEffect(() => {
    if (texts.length <= 1) {
      return undefined;
    }

    const id = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % texts.length;
        onIndexChange?.(next);
        return next;
      });
    }, cycleDuration);

    return (): void => {
      clearInterval(id);
    };
  }, [texts.length, cycleDuration, onIndexChange]);

  React.useEffect(() => {
    setCurrentIndex(0);
    onIndexChange?.(0);
    // Reset when the texts array identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts]);

  const renderContent = (text: string): React.ReactNode => {
    return children ? children(text) : text;
  };

  if (texts.length <= 1) {
    return <span>{renderContent(texts[0])}</span>;
  }

  const slideVariants: MotionVariantsType = {
    initial: { y: 16, opacity: 0, filter: 'blur(4px)' },
    animate: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: slideDuration, ease: slideEase },
    },
    exit: {
      y: -16,
      opacity: 0,
      filter: 'blur(4px)',
      position: 'absolute' as const,
      transition: { duration: slideDuration, ease: slideEase },
    },
  };

  return (
    <Box position="relative" display="inline-grid" overflow="hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <BaseMotionBox key={currentIndex} motionVariants={slideVariants}>
          <Box position="relative" overflow="hidden" whiteSpace="nowrap">
            {renderContent(texts[currentIndex])}
            {showShimmer && <ShimmerOverlay />}
          </Box>
        </BaseMotionBox>
      </AnimatePresence>
    </Box>
  );
};

export { RollingText };
export type { RollingTextProps };
