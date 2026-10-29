import { AlertCircleIcon, CheckIcon } from '~components/Icons';
import { size } from '~tokens/global';

/*
 * Sticky cells in a Table can overlap each other, so their stacking order is fixed explicitly:
 * refresh overlay > sticky column header/footer cells (the corners) > sticky column body cells >
 * other cells. Ties are resolved by DOM order, which is why the corner cells need a strictly
 * higher z-index than the body cells painted after them, why the isRefreshing overlay sits above
 * every sticky cell so the whole table - corners included - dims evenly while refreshing, and why
 * all sticky header/footer cells share the corner z-index instead of a lower one (see the comment
 * in Table.web.tsx).
 */
const firstColumnStickyZIndex = 2;
const firstColumnStickySpannedZIndex = 3;
const firstColumnStickyCornerZIndex = 5;

// Above the entire sticky scale (see the stacking order above) so the refresh overlay covers
// the sticky header/footer corner cells too instead of leaving them bright while refreshing.
const refreshWrapperZIndex = firstColumnStickyCornerZIndex + 1;

const checkboxCellWidth = size['44'];

// Divider drawn after the last sticky column so the scrolling columns read as sliding under it.
// A step stronger than the row/cell borders so it still stands out with showBorderedCells. Once
// the table is scrolled horizontally the divider also casts a shadow over the scrolling columns.
const tableStickyColumn = {
  dividerWidth: 'thin',
  dividerColor: 'surface.border.gray.subtle',
  shadowElevation: 'midRaised',
  shadowMotionDuration: 'duration.quick',
  shadowMotionEasing: 'easing.standard',
} as const;

const tableBackgroundColor = 'surface.background.gray.intense';
const tableHeader = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  backgroundColor: 'surface.background.gray.moderate',
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.gray.muted',
} as const;

const tableFooter = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.gray.muted',
  backgroundColor: 'interactive.background.gray.faded',
} as const;

const tableRow = {
  paddingLeft: {
    compact: 'spacing.4',
    normal: 'spacing.4',
    comfortable: 'spacing.4',
  },
  paddingRight: {
    compact: 'spacing.4',
    normal: 'spacing.4',
    comfortable: 'spacing.4',
  },
  minHeight: {
    compact: '36',
    normal: '48',
    comfortable: '60',
  },
  nonStripe: {
    backgroundColor: 'transparent',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorFocus: 'transparent',
    // TODO: Rebranding - on design side: explore pressed state color change, right now both hover & active are same
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedHover: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedFocus: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedActive: 'interactive.background.gray.fadedHighlighted',
  },
  nonStripeWrapper: {
    // not used anywhere
    backgroundColor: 'transparent',
    backgroundColorHover: 'transparent',
    backgroundColorFocus: 'transparent',
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'transparent',
    backgroundColorSelectedHover: 'transparent',
    backgroundColorSelectedFocus: 'transparent',
    backgroundColorSelectedActive: 'transparent',
  },
  stripe: {
    backgroundColor: 'transparent',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorFocus: 'transparent',
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedHover: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedFocus: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedActive: 'interactive.background.gray.fadedHighlighted',
  },
  stripeWrapper: {
    backgroundColor: 'interactive.background.gray.default',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorFocus: 'interactive.background.gray.default',
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'interactive.background.gray.default',
    backgroundColorSelectedHover: 'interactive.background.gray.default',
    backgroundColorSelectedFocus: 'interactive.background.gray.default',
    backgroundColorSelectedActive: 'interactive.background.gray.default',
  },
  borderBottomWidth: 'thin',
  borderColor: 'surface.border.gray.muted',
  backgroundColorMotionEasing: 'easing.standard',
  backgroundColorMotionDuration: 'duration.xquick',
  groupHeaderBackgroundColor: 'surface.background.gray.moderate',
} as const;

const tableToolbar = {
  backgroundColor: 'transparent',
  backgroundColorSelected: 'interactive.background.primary.faded',
  backgroundColorMotionEasing: 'easing.standard',
  backgroundColorMotionDuration: 'duration.xquick',
  minHeight: size[37], // 37px to accommodate 1px border, matching TableHeader height
  padding: ['spacing.3', 'spacing.3', 'spacing.3', 'spacing.4'],
} as const;

const tablePagination = {
  defaultPageSize: 10,
  backgroundColor: 'surface.background.gray.moderate',
} as const;

const tableEditableCellRowDensityToInputSizeMap = {
  compact: 'small',
  normal: 'medium',
  comfortable: 'large',
} as const;

const validationStateToInputTrailingIconMap = {
  none: undefined,
  success: CheckIcon,
  error: AlertCircleIcon,
};

const rowDensityToIsTableInputCellMapping = {
  comfortable: false,
  normal: true,
  compact: true,
};

const classes = {
  HOVER_ACTIONS: 'hover-actions',
  HOVER_ACTIONS_LAYER2: 'hover-actions-layer-2',
  HOVER_ACTIONS_LAYER3: 'hover-actions-layer-3',
  HAS_ROW_SPANNING: 'has-row-spanning',
  // Set on every body row, and on body rows that render hover actions, see the sticky columns in
  // Table.web.tsx
  BODY_ROW: 'blade-table-body-row',
  HAS_HOVER_ACTIONS: 'has-hover-actions',
};

export {
  tableHeader,
  tableFooter,
  tableRow,
  tableToolbar,
  tablePagination,
  refreshWrapperZIndex,
  tableBackgroundColor,
  firstColumnStickyZIndex,
  firstColumnStickySpannedZIndex,
  firstColumnStickyCornerZIndex,
  checkboxCellWidth,
  tableStickyColumn,
  tableEditableCellRowDensityToInputSizeMap,
  validationStateToInputTrailingIconMap,
  rowDensityToIsTableInputCellMapping,
  classes,
};
