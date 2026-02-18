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

const RollingText = ({
  texts,
}: {
  /** Array of strings to cycle through with a rolling animation */
  texts: string[];
}): React.ReactElement => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const cycleDuration = theme.motion.delay.xlong;
  const slideDuration = msToSeconds(theme.motion.duration.xmoderate);
  const slideEase = cssBezierToArray(castWebType(theme.motion.easing.emphasized));

  React.useEffect(() => {
    if (texts.length <= 1) {
      return undefined;
    }

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, cycleDuration);

    return (): void => {
      clearInterval(id);
    };
  }, [texts.length, cycleDuration]);

  // For a single string, skip all animation overhead.
  if (texts.length <= 1) {
    return <span>{texts[0]}</span>;
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
          <span style={{ whiteSpace: 'nowrap' }}>
            <Box position="relative" overflow="hidden">
              {texts[currentIndex]}
              <ShimmerOverlay />
            </Box>
          </span>
        </BaseMotionBox>
      </AnimatePresence>
    </Box>
  );
};

export { RollingText };
