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

const getCollapsibleChevronIconTransforms = (): {
  transformExpanded: number;
  transformCollapsed: number;
} => ({ transformExpanded: -180, transformCollapsed: 0 });

export {
  getCollapsibleBodyContentBoxProps,
  getOpacity,
  getTransitionDuration,
  getTransitionEasing,
  getCollapsibleChevronIconTransforms,
};
