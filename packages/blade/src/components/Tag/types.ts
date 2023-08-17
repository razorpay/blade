import { StyledPropsBlade } from '~components/Box/styledProps';
import { IconComponent } from '~components/Icons';
import { StringChildrenType, TestID } from '~utils/types';

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
  _isVirtuallyFocussed?: boolean;

  /**
   * Is tag placed inside an input
   *
   * @private
   */
  _isTagInsideInput?: boolean;
} & StyledPropsBlade &
  TestID;

type TagsGroupProps = {
  tags: string[];
  activeTagIndex: number;
  onDismiss: ({ tagIndex, tagName }: { tagIndex: number; tagName: TagProps['children'] }) => void;
};

type AnimatedTagProps = {
  children: TagProps['children'];
  currentTagIndex: number;
  activeTagIndex: number;
  onDismiss: TagsGroupProps['onDismiss'];
  tagsLength: number;
};

export { TagProps, AnimatedTagProps, TagsGroupProps };
