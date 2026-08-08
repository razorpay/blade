import React from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { castWebType } from '~utils';
import { makeMotionTime } from '~utils/makeMotionTime';

const StyledTreeViewAnimator = styled(BaseBox)<{ isExpanded: boolean }>((props) => ({
  display: 'grid',
  // B5: animate grid-template-rows (0fr <-> 1fr), never height
  gridTemplateRows: props.isExpanded ? '1fr' : '0fr',
  transition: `grid-template-rows ${makeMotionTime(
    props.theme.motion.duration.quick,
  )} ${castWebType(props.theme.motion.easing.standard)}`,
  '& > div': {
    overflow: 'hidden',
    minHeight: '0px',
    visibility: props.isExpanded ? 'visible' : 'hidden',
    // keep content visible while the collapse animation runs, then hide it (also removes it from AT)
    transition: props.isExpanded
      ? undefined
      : `visibility 0s linear ${makeMotionTime(props.theme.motion.duration.quick)}`,
  },
}));

/**
 * Marks a "mount scope": the ref is `true` while the scope (the whole tree, or one
 * children group) is doing its very first render, and flips to `false` after mount.
 *
 * A row reading `true` mounted together with its scope (initial tree mount, or a whole
 * async group mounting - the scope's own animation covers it). A row reading `false`
 * was appended into an existing scope later (e.g. through TreeViewLoadMore) and
 * animates its own mount
 */
const TreeViewMountScopeContext = React.createContext<React.MutableRefObject<boolean> | null>(null);

const useTreeViewMountScopeRef = (): React.MutableRefObject<boolean> => {
  const isScopeFirstRenderRef = React.useRef(true);
  React.useEffect(() => {
    isScopeFirstRenderRef.current = false;
  }, []);
  return isScopeFirstRenderRef;
};

/**
 * Expand / collapse animation for a branch's children group (B5)
 *
 * Also starts a new mount scope so rows mounting together with the group don't
 * double-animate on top of the group's own mount animation
 */
const TreeViewGroupAnimator = ({
  isExpanded,
  shouldAnimateMount,
  children,
}: {
  isExpanded: boolean;
  shouldAnimateMount: boolean;
  children: React.ReactNode;
}): React.ReactElement => {
  const isScopeFirstRenderRef = useTreeViewMountScopeRef();

  // B5: when async children arrive while the branch is already expanded, the group mounts
  // directly in the expanded (1fr) state and would paint statically. Mount it collapsed
  // and flip on the next frame so the 0fr -> 1fr transition runs
  const [isMountFramePending, setIsMountFramePending] = React.useState(
    shouldAnimateMount && isExpanded,
  );
  React.useEffect(() => {
    if (!isMountFramePending) {
      return undefined;
    }
    const animationFrame = requestAnimationFrame(() => setIsMountFramePending(false));
    return () => cancelAnimationFrame(animationFrame);
  }, [isMountFramePending]);

  return (
    <TreeViewMountScopeContext.Provider value={isScopeFirstRenderRef}>
      <StyledTreeViewAnimator isExpanded={isExpanded && !isMountFramePending}>
        {children}
      </StyledTreeViewAnimator>
    </TreeViewMountScopeContext.Provider>
  );
};

const AnimatedRowMount = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  // same trick as the group animator: mount collapsed (0fr), flip to 1fr on the next frame
  const [isMountFramePending, setIsMountFramePending] = React.useState(true);
  React.useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setIsMountFramePending(false));
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <StyledTreeViewAnimator isExpanded={!isMountFramePending}>{children}</StyledTreeViewAnimator>
  );
};

/**
 * Animates a row's own mount when it is appended into an already-mounted scope
 * (e.g. new rows arriving through TreeViewLoadMore). Rows mounting together with
 * their scope render as-is - the scope's animation (if any) covers them
 */
const TreeViewRowMountAnimator = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement => {
  const scopeRef = React.useContext(TreeViewMountScopeContext);
  // captured once on the row's first render: a later flip of the scope ref must not re-wrap the row
  const shouldAnimateMountRef = React.useRef(scopeRef ? !scopeRef.current : false);

  if (!shouldAnimateMountRef.current) {
    return children;
  }
  return <AnimatedRowMount>{children}</AnimatedRowMount>;
};

export {
  TreeViewGroupAnimator,
  TreeViewRowMountAnimator,
  TreeViewMountScopeContext,
  useTreeViewMountScopeRef,
};
