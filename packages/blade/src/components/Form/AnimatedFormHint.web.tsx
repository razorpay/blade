import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import styled from 'styled-components';
import { formHintMotion } from './formTokens';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime, makeSize } from '~utils';
import getIn from '~utils/lodashButBetter/get';

const HEIGHT_INTRINSIC = 'auto';
const HEIGHT_COLLAPSED = '0px';

const StyledAnimatedFormHint = styled(BaseBox)<{
  isVisible: boolean;
  $height: string;
}>(({ theme, isVisible, $height }) => {
  const phase = isVisible ? 'enter' : 'exit';

  return {
    overflowY: 'hidden',
    height: $height,
    opacity: isVisible ? 1 : 0,
    transitionProperty: 'height, opacity',
    transitionDuration: castWebType(
      makeMotionTime(getIn(theme.motion.duration, formHintMotion[phase].duration)),
    ),
    transitionTimingFunction: castWebType(theme.motion.easing[formHintMotion[phase].easing]),
  };
});

const StyledFormHintContent = styled(BaseBox)({
  /**
   * Establishes a block formatting context so the hint's own top margin is
   * measured as part of this box instead of collapsing out through it.
   */
  display: 'flow-root',
});

type AnimatedFormHintProps = {
  /**
   * Whether the hint is revealed. Drives the enter / exit transition.
   */
  isVisible: boolean;
  children: ReactNode;
};

/**
 * Eases the form hint's entry and exit instead of mounting it instantly, so
 * content below slides rather than jumping.
 *
 * `height: auto` is not animatable, so the hint is measured and the container
 * transitions between two concrete pixel values. The measurement is deliberately
 * *not* deferred to `requestAnimationFrame`: rAF is throttled in background tabs
 * and in inactive iframes, which would strand the hint at zero height while it is
 * logically visible. Driving height straight from props keeps every state
 * reachable in one render, with or without a frame callback.
 *
 * The children stay mounted while collapsed — only clipped to zero height — so
 * the id the input's `aria-describedby` points at remains resolvable and screen
 * readers still announce the help text on focus.
 */
const AnimatedFormHint = ({ isVisible, children }: AnimatedFormHintProps): ReactElement => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState<number | null>(null);

  React.useEffect(() => {
    const contentElement = contentRef.current;

    if (!contentElement) {
      return undefined;
    }

    const measure = (): void => {
      const measuredHeight = contentElement.offsetHeight;

      if (measuredHeight > 0) {
        setContentHeight(measuredHeight);
      }
    };

    measure();

    /**
     * Re-measures when the hint reflows — a longer message, a container resize
     * that rewraps it to two lines, or a font swap.
     */
    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(contentElement);

    return () => resizeObserver.disconnect();
  }, []);

  /**
   * Before the first measurement there is no pixel height to use, which is also
   * the server rendered case. A hint that starts visible therefore renders at its
   * intrinsic height and is swapped to the measured value with no visual change.
   */
  const height =
    contentHeight === null
      ? isVisible
        ? HEIGHT_INTRINSIC
        : HEIGHT_COLLAPSED
      : makeSize(isVisible ? contentHeight : 0);

  return (
    <StyledAnimatedFormHint
      isVisible={isVisible}
      $height={height}
      // stable hook for tests and debugging, same convention as `__blade-base-input-wrapper`
      className="__blade-animated-form-hint"
    >
      <StyledFormHintContent ref={contentRef as never}>{children}</StyledFormHintContent>
    </StyledAnimatedFormHint>
  );
};

export { AnimatedFormHint };
export type { AnimatedFormHintProps };
