import type { TreeViewProps } from './types';
import type { Theme } from '~components/BladeProvider';
import type { CheckboxProps } from '~components/Checkbox';
import type { IconSize } from '~components/Icons';
import type { BoxProps } from '~components/Box';
import { size } from '~tokens/global';

type TreeViewSize = NonNullable<TreeViewProps['size']>;

const treeViewTokens: Record<
  TreeViewSize,
  {
    /**
     * Width of the chevron slot that every row reserves (empty on leaves)
     */
    chevronSlotSize: number;
    chevronIconSize: IconSize;
    checkboxSize: NonNullable<CheckboxProps['size']>;
    titleTextSize: 'small' | 'medium';
    loadMoreTextSize: 'small' | 'medium';
    /**
     * Left offset of the LoadMore label: one chevron slot + the `spacing.2` gap after it,
     * so the label lines up with the content of its sibling rows
     */
    loadMoreIndentation: BoxProps['paddingLeft'];
    /**
     * One indentation step per depth. Matches the chevron slot plus its gap, so a child's
     * content sits exactly one step to the right of its parent's content
     * (Figma: TreeView.Indentation.level-N)
     */
    indentationPerLevel: number;
    /**
     * Typography line-height token the row's first line is sized from
     */
    lineHeight: 75 | 100;
  }
> = {
  small: {
    chevronSlotSize: size[16],
    chevronIconSize: 'small',
    checkboxSize: 'small',
    titleTextSize: 'small',
    loadMoreTextSize: 'small',
    loadMoreIndentation: 'spacing.6',
    indentationPerLevel: size[20],
    lineHeight: 75,
  },
  medium: {
    chevronSlotSize: size[20],
    chevronIconSize: 'medium',
    checkboxSize: 'medium',
    titleTextSize: 'medium',
    loadMoreTextSize: 'medium',
    loadMoreIndentation: 'spacing.7',
    indentationPerLevel: size[24],
    lineHeight: 100,
  },
};

/**
 * Height of a row's first line, which every slot (chevron, checkbox, leading, title, trailing)
 * is aligned to. Derived from the title's line-height, so a row is
 * `lineHeight + BaseMenuItem padding * 2` tall: 33px for small and 36px for medium (Figma)
 */
const getItemFirstRowHeight = (theme: Theme, treeViewSize: TreeViewSize): number =>
  theme.typography.lineHeights[treeViewTokens[treeViewSize].lineHeight];

export { treeViewTokens, getItemFirstRowHeight };
export type { TreeViewSize };
