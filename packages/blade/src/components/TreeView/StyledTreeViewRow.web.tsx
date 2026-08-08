import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { makeSize } from '~utils';

/**
 * One indentation step per depth: the 20px chevron slot + the 4px (spacing.2) gap after it.
 * Because a branch's chevron occupies exactly one step, a child's content starts at the
 * same column as its parent's content (Figma: TreeView.Indentation.level-N = 8 + 24N)
 */
const TREEVIEW_INDENTATION_PER_LEVEL = size[24];

/**
 * Wraps every TreeView row (item / loadMore). Indentation is applied as the row's own
 * padding-left (instead of padding on nested groups) so hover / selected / focus
 * backgrounds stay full-bleed across the whole tree width at any depth
 */
const StyledTreeViewRow = styled(BaseBox)<{ level: number }>((props) => ({
  '& > [role="treeitem"]': {
    paddingLeft: makeSize(
      props.theme.spacing[3] + TREEVIEW_INDENTATION_PER_LEVEL * (props.level - 1),
    ),
    // rows are contiguous 36px rows per Figma (no vertical margin between rows)
    marginTop: makeSize(size[0]),
    marginBottom: makeSize(size[0]),
  },
  // BaseMenu highlights any row with aria-expanded="true" (used by Menu for open submenus).
  // In TreeView the chevron indicates expansion, so an expanded branch must look like a normal row
  '& > [role="treeitem"][aria-expanded="true"]:not(:hover):not([aria-selected="true"])': {
    backgroundColor: 'transparent',
  },
}));

export { StyledTreeViewRow, TREEVIEW_INDENTATION_PER_LEVEL };
