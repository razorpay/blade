import type { ReactElement, ReactNode, TransitionEventHandler } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import { useCollapsibleContext } from './CollapsibleContext';
import { castWebType, makeMotionTime, makeSize } from '~utils';
import { useDidUpdate } from '~src/hooks/useDidUpdate';

type CollapsiblePanelProps = {
  children: ReactNode;
};

type StyledCollapsiblePanelProps = {
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
const StyledCollapsiblePanel = styled.div<StyledCollapsiblePanelProps>((props) => {
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

const CollapsiblePanel = ({ children }: CollapsiblePanelProps): ReactElement => {
  const { isExpanded, defaultIsExpanded } = useCollapsibleContext();
  const collapsiblePanelRef = useRef<HTMLDivElement>(null);

  /**
   * This effect imperatively updates height to make css transitions work:
   * - for expanded items: auto height -> actual height -> 0px
   * - for collapsed items: 0px -> actual height -> auto height
   * - uses `requestAnimationFrame` to set the styles just before the next repaint
   */
  useDidUpdate(() => {
    const collapsiblePanelElement = collapsiblePanelRef.current;

    if (!collapsiblePanelElement) {
      return;
    }

    // In collapsed state display is set to none, change it back to block
    collapsiblePanelElement.style.display = 'block';
    const actualHeight = collapsiblePanelElement.scrollHeight;

    if (!isExpanded) {
      // collapse
      requestAnimationFrame(() => {
        collapsiblePanelElement.style.height = makeSize(actualHeight);

        requestAnimationFrame(() => {
          collapsiblePanelElement.style.height = makeSize(0);
        });
      });
    } else {
      // expand
      requestAnimationFrame(() => {
        collapsiblePanelElement.style.height = makeSize(0);

        requestAnimationFrame(() => {
          collapsiblePanelElement.style.height = makeSize(actualHeight);

          /**
           * After this we want to wait for the animation to finish
           * before setting the height back to auto
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
    const collapsiblePanelElement = collapsiblePanelRef.current;
    if (propertyName === 'height' && collapsiblePanelElement) {
      if (isExpanded) {
        // Panel has expanded and finished animating at this point
        requestAnimationFrame(() => {
          collapsiblePanelElement.style.height = HEIGHT_EXPANDED;
        });
      } else {
        // Panel has collapsed
        requestAnimationFrame(() => {
          collapsiblePanelElement.style.display = 'none';
        });
      }
    }
  };

  return (
    <StyledCollapsiblePanel
      ref={collapsiblePanelRef}
      isExpanded={isExpanded}
      defaultIsExpanded={defaultIsExpanded}
      onTransitionEnd={onTransitionEnd}
    >
      {children}
    </StyledCollapsiblePanel>
  );
};

export { CollapsiblePanel };
