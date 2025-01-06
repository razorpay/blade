import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { IconComponent } from '~components/Icons';
import type { DataAnalyticsAttribute, StringChildrenType, TestID } from '~utils/types';

type TagProps = {
  /**
   * Decides the size of Tag
   *
   * @default medium
   */
  size?: 'medium' | 'large';

  /**
   * Leading icon for your Tag
   */
  icon?: IconComponent;

  /**
   * Callback when close icon on Tag is clicked
   */
  onDismiss: () => void;

  /**
   * Text that renders inside Tag
   */
  children: StringChildrenType;

  /**
   * Disable tag
   */
  isDisabled?: boolean;

  /**
   * Private property for Blade.
   *
   * Should not be used by consumers.
   *
   * Used for adding virtual focus on tag.
   *
   * @private
   */
  _isVirtuallyFocused?: boolean;

  /**
   * Private property for Blade.
   *
   * Should not be used by consumers.
   *
   * Is tag placed inside an input
   *
   * @private
   */
  _isTagInsideInput?: boolean;
} & StyledPropsBlade &
  DataAnalyticsAttribute &
  TestID;

type TagsGroupProps = {
  tags: string[];
  activeTagIndex: number;
  isDisabled: TagProps['isDisabled'];
  onDismiss: ({ tagIndex, tagName }: { tagIndex: number; tagName: TagProps['children'] }) => void;
  size?: TagProps['size'];
};

type AnimatedTagProps = {
  children: TagProps['children'];
  isDisabled: TagProps['isDisabled'];
  currentTagIndex: number;
  activeTagIndex: number;
  onDismiss: TagsGroupProps['onDismiss'];
  tagsLength: number;
  size: TagProps['size'];
};

export type { TagProps, AnimatedTagProps, TagsGroupProps };
