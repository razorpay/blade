import type { CollapsibleProps } from './Collapsible';
import type { Theme } from '~components/BladeProvider';
import type { BoxProps } from '~components/Box';
import { makeMotionTime } from '~utils';

const getCollapsibleBodyContentBoxProps = ({
  direction,
}: {
  direction: CollapsibleProps['direction'];
}): BoxProps => ({
  /**
   * Need a margin inside the outside wrapper so this is
   * included in height calculations and prevents jank
   */
  marginTop: direction === 'bottom' ? 'spacing.5' : 'spacing.0',
  marginBottom: direction === 'top' ? 'spacing.5' : 'spacing.0',
});

const getOpacity = ({ isExpanded }: { isExpanded: boolean }): number => (isExpanded ? 1 : 0.8);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getTransitionDuration = (theme: Theme) => makeMotionTime(theme.motion.duration.xmoderate);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getTransitionEasing = (theme: Theme) => theme.motion.easing.standard.effective;

type TransformRotation = -180 | 0;

/**
 * The orientation of chevron icon inverts based on the direction collapsible expands in.
 * `transformExpanded` and `transformCollapsed` therefore need to swap their corresponding expanded and collapsed values.
 */
const getCollapsibleChevronIconTransforms = ({
  direction,
}: {
  direction: CollapsibleProps['direction'];
}): { transformExpanded: TransformRotation; transformCollapsed: TransformRotation } => {
  let transformExpanded: TransformRotation, transformCollapsed: TransformRotation;
  if (direction === 'bottom') {
    transformExpanded = -180;
    transformCollapsed = 0;
  } else {
    transformExpanded = 0;
    transformCollapsed = -180;
  }
  return { transformExpanded, transformCollapsed };
};

export {
  getCollapsibleBodyContentBoxProps,
  getOpacity,
  getTransitionDuration,
  getTransitionEasing,
  getCollapsibleChevronIconTransforms,
};
