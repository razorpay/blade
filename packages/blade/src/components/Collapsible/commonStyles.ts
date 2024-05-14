import type { CollapsibleProps } from './Collapsible';
import type { CollapsibleBodyProps } from './types';
import type { Theme } from '~components/BladeProvider';
import type { BoxProps } from '~components/Box';
import { makeMotionTime } from '~utils';

const getCollapsibleBodyContentBoxProps = ({
  direction,
  _hasMargin,
}: {
  direction: CollapsibleProps['direction'];
  _hasMargin: CollapsibleBodyProps['_hasMargin'];
}): BoxProps => {
  const marginTop = direction === 'bottom' ? 'spacing.5' : 'spacing.0';
  const marginBottom = direction === 'top' ? 'spacing.5' : 'spacing.0';
  return {
    /**
     * Need a margin inside the outside wrapper so this is
     * included in height calculations and prevents jank
     */
    marginTop: _hasMargin ? marginTop : undefined,
    marginBottom: _hasMargin ? marginBottom : undefined,
  };
};

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
