import styled from 'styled-components';
import type { TreeViewSize } from './treeViewTokens';
import { treeViewTokens } from './treeViewTokens';
import BaseBox from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { makeSize } from '~utils';

/**
 * Wraps every TreeView row (item / loadMore). Indentation is applied as the row's own
 * padding-left (instead of padding on nested groups) so hover / selected / focus
 * backgrounds stay full-bleed across the whole tree width at any depth
 */
const StyledTreeViewRow = styled(BaseBox)<{ level: number; treeViewSize: TreeViewSize }>(
  (props) => ({
    '& > [role="treeitem"]': {
      paddingLeft: makeSize(
        props.theme.spacing[3] +
          treeViewTokens[props.treeViewSize].indentationPerLevel * (props.level - 1),
      ),
      // rows are contiguous per Figma (no vertical margin between rows):
      // 33px on small and 36px on medium
      marginTop: makeSize(size[0]),
      marginBottom: makeSize(size[0]),
    },
    // BaseMenu highlights any row with aria-expanded="true" (used by Menu for open submenus).
    // In TreeView the chevron indicates expansion, so an expanded branch must look like a normal row
    '& > [role="treeitem"][aria-expanded="true"]:not(:hover):not([aria-selected="true"])': {
      backgroundColor: 'transparent',
    },
  }),
);

export { StyledTreeViewRow };
