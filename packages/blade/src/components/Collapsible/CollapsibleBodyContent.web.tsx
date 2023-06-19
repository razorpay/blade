import type { ReactElement, TransitionEventHandler } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import { useCollapsible } from './CollapsibleContext';
import { useDidUpdate } from './useDidUpdate';
import type { CollapsibleBodyContentProps } from './types';
import { castWebType, makeMotionTime, makeSize } from '~utils';
import { Box } from '~components/Box';

type StyledCollapsibleBodyContentProps = {
  defaultIsExpanded: boolean;
  isExpanded: boolean;
};

/**
 * We can't animate to and from `auto` height, these are used for imperative css transitions.
 * Overall on expanding height will change as: 0px -> Actual height -> auto
 */
const HEIGHT_EXPANDED = 'auto';
const HEIGHT_COLLAPSED = '0px';

// TODO: move common styles when implementing native
const StyledCollapsibleBodyContent = styled.div<StyledCollapsibleBodyContentProps>((props) => {
  const { theme, defaultIsExpanded, isExpanded } = props;
  return {
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xmoderate)),
    transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
    transitionProperty: 'height, opacity',
    opacity: isExpanded ? 1 : 0.8,
    /**
     * We need height explicitly here for initial styles because the component might be rendered on server,
     * in which case for expanded items this should be `auto` because we don't know the actual pixel value.
     *
     * This is based on `defaultIsExpanded` rather than `isExpanded` because post initial render inline styles take over.
     * Otherwise, changing `height` both here and in inline styles sometimes causes animation flickers due to styles mismatch.
     */
    height: defaultIsExpanded ? HEIGHT_EXPANDED : HEIGHT_COLLAPSED,
    display: defaultIsExpanded ? 'block' : 'none',
    overflowY: 'hidden',
  };
});

const CollapsibleBodyContent = ({ children }: CollapsibleBodyContentProps): ReactElement => {
  const { isExpanded, defaultIsExpanded, direction } = useCollapsible();
  const collapsibleBodyContentRef = useRef<HTMLDivElement>(null);

  /**
   * This effect imperatively updates height to make css transitions work:
   * - for expanded items: auto height -> actual height -> 0px
   * - for collapsed items: 0px -> actual height -> auto height
   * - uses `requestAnimationFrame` to set the styles just before the next repaint
   */
  useDidUpdate(() => {
    const collapsibleBodyContentElement = collapsibleBodyContentRef.current;

    if (!collapsibleBodyContentElement) {
      return;
    }

    // In collapsed state display is set to none, change it back to block
    collapsibleBodyContentElement.style.display = 'block';
    const actualHeight = collapsibleBodyContentElement.scrollHeight;

    if (!isExpanded) {
      // collapse
      requestAnimationFrame(() => {
        collapsibleBodyContentElement.style.height = makeSize(actualHeight);

        requestAnimationFrame(() => {
          collapsibleBodyContentElement.style.height = makeSize(0);
        });
      });
    } else {
      // expand
      requestAnimationFrame(() => {
        collapsibleBodyContentElement.style.height = makeSize(0);

        requestAnimationFrame(() => {
          collapsibleBodyContentElement.style.height = makeSize(actualHeight);

          /**
           * After this we want to wait for the animation to finish
           * before setting the height back to auto
           *
           * `onTransitionEnd` takes over
           */
        });
      });
    }
  }, [isExpanded]);

  /**
   * When expanding, waits for the animation to finish first.
   * Then sets the height of expanded item to auto from actual height.
   */
  const onTransitionEnd: TransitionEventHandler = ({ propertyName }) => {
    const collapsibleBodyContentElement = collapsibleBodyContentRef.current;
    if (propertyName === 'height' && collapsibleBodyContentElement) {
      if (isExpanded) {
        // Body content has expanded and finished animating at this point
        requestAnimationFrame(() => {
          collapsibleBodyContentElement.style.height = HEIGHT_EXPANDED;
        });
      } else {
        // Body content has collapsed
        requestAnimationFrame(() => {
          collapsibleBodyContentElement.style.display = 'none';
        });
      }
    }
  };

  return (
    <StyledCollapsibleBodyContent
      ref={collapsibleBodyContentRef}
      isExpanded={isExpanded}
      defaultIsExpanded={defaultIsExpanded}
      onTransitionEnd={onTransitionEnd}
    >
      <Box
        /**
         * Need a margin inside the outside wrapper so this is
         * included in height calculations and prevents jank
         */
        marginTop={direction === 'bottom' ? 'spacing.5' : 'spacing.0'}
        marginBottom={direction === 'top' ? 'spacing.5' : 'spacing.0'}
      >
        {children}
      </Box>
    </StyledCollapsibleBodyContent>
  );
};

export { CollapsibleBodyContent };
