import type { ReactElement } from 'react';
import React, { Children } from 'react';
import { useTreeView } from './TreeViewContext';
import type { TreeViewItemProps } from './types';
import { componentIds } from './componentIds';
import { BaseBox } from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { ChevronDownIcon, ChevronRightIcon } from '~components/Icons';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { isReactNative } from '~utils';

type TreeViewItemInternalProps = TreeViewItemProps & {
  /** Internal: nesting depth used for indentation */
  _depth?: number;
};

const INDENT_SIZE_PX = 24;

const _TreeViewItem = ({
  id,
  label,
  icon: Icon,
  trailing,
  isDisabled = false,
  children,
  testID,
  _depth = 0,
  ...rest
}: TreeViewItemInternalProps): ReactElement => {
  const { selectionType, selectedIds, expandedIds, onNodeSelect, onNodeToggle } = useTreeView();

  const hasChildren = Children.count(children) > 0;
  const isExpanded = expandedIds.includes(id);
  const isSelected = selectionType !== 'none' && selectedIds.includes(id);

  const handlePress = (): void => {
    if (isDisabled) return;
    if (hasChildren) {
      onNodeToggle(id);
    }
    if (selectionType !== 'none') {
      onNodeSelect(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (isDisabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePress();
    }
    if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
      onNodeToggle(id);
    }
    if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
      onNodeToggle(id);
    }
  };

  const indentLeftPx = _depth * INDENT_SIZE_PX;

  return (
    <BaseBox
      {...makeAccessible({
        role: 'treeitem',
        expanded: hasChildren ? isExpanded : undefined,
        selected: selectionType !== 'none' ? isSelected : undefined,
      })}
      {...metaAttribute({ name: MetaConstants.TreeViewItem, testID })}
      {...makeAnalyticsAttribute(rest)}
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={handleKeyDown as never}
    >
      {/* Row */}
      <BaseBox
        display="flex"
        alignItems="center"
        paddingY="spacing.2"
        paddingRight="spacing.4"
        paddingLeft="spacing.2"
        borderRadius="medium"
        cursor={isReactNative() ? undefined : isDisabled ? 'not-allowed' : 'pointer'}
        backgroundColor={isSelected ? 'interactive.background.primary.faded' : 'transparent'}
        onClick={handlePress as never}
        opacity={isDisabled ? 0.4 : 1}
      >
        {/* Indentation spacer */}
        {indentLeftPx > 0 && (
          <span style={{ display: 'inline-block', flexShrink: 0, width: `${indentLeftPx}px` }} />
        )}
        {/* Expand/collapse chevron */}
        <BaseBox
          width="spacing.6"
          height="spacing.6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDownIcon size="small" color="surface.icon.gray.muted" />
            ) : (
              <ChevronRightIcon size="small" color="surface.icon.gray.muted" />
            )
          ) : null}
        </BaseBox>

        {/* Optional icon */}
        {Icon && (
          <BaseBox marginRight="spacing.2" display="flex" alignItems="center">
            <Icon
              size="small"
              color={isSelected ? 'interactive.icon.primary.normal' : 'surface.icon.gray.normal'}
            />
          </BaseBox>
        )}

        {/* Label */}
        <Text
          size="medium"
          color={
            isDisabled
              ? 'surface.text.gray.disabled'
              : isSelected
              ? 'interactive.text.primary.normal'
              : 'surface.text.gray.normal'
          }
          weight={isSelected ? 'semibold' : 'regular'}
          truncateAfterLines={1}
        >
          {label}
        </Text>

        {/* Trailing slot */}
        {trailing && <BaseBox marginLeft="spacing.2">{trailing}</BaseBox>}
      </BaseBox>

      {/* Children group */}
      {hasChildren && isExpanded && (
        <BaseBox {...makeAccessible({ role: 'group' })}>
          {Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;
            return React.cloneElement(child as React.ReactElement<TreeViewItemInternalProps>, {
              _depth: _depth + 1,
            });
          })}
        </BaseBox>
      )}
    </BaseBox>
  );
};

const TreeViewItem = assignWithoutSideEffects(_TreeViewItem, {
  componentId: componentIds.TreeViewItem,
});

export type { TreeViewItemProps };
export { TreeViewItem };
