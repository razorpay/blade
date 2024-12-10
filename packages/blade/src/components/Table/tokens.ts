import { AlertCircleIcon, CheckIcon } from '~components/Icons';
import { size } from '~tokens/global';

const firstColumnStickyZIndex = 2;

const refreshWrapperZIndex = 3;

const checkboxCellWidth = size['44'];

const tableBackgroundColor = 'surface.background.gray.intense';
const tableHeader = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  backgroundColor: 'interactive.background.gray.default',
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
  backgroundColor: 'interactive.background.gray.default',
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
    backgroundColorSelected: 'interactive.background.primary.faded',
    backgroundColorSelectedHover: 'interactive.background.primary.fadedHighlighted',
    backgroundColorSelectedFocus: 'interactive.background.primary.faded',
    backgroundColorSelectedActive: 'interactive.background.primary.fadedHighlighted',
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
    backgroundColorSelected: 'interactive.background.primary.faded',
    backgroundColorSelectedHover: 'interactive.background.primary.fadedHighlighted',
    backgroundColorSelectedFocus: 'interactive.background.primary.faded',
    backgroundColorSelectedActive: 'interactive.background.primary.fadedHighlighted',
  },
  stripeWrapper: {
    backgroundColor: 'interactive.background.gray.default',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorFocus: 'interactive.background.gray.default',
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'interactive.background.primary.faded',
    backgroundColorSelectedHover: 'interactive.background.primary.faded',
    backgroundColorSelectedFocus: 'interactive.background.primary.faded',
    backgroundColorSelectedActive: 'interactive.background.primary.faded',
  },
  borderBottomWidth: 'thin',
  borderColor: 'surface.border.gray.muted',
  backgroundColorMotionEasing: 'easing.standard',
  backgroundColorMotionDuration: 'duration.xquick',
} as const;

const tableToolbar = {
  backgroundColor: 'transparent',
  backgroundColorSelected: 'interactive.background.primary.faded',
  backgroundColorMotionEasing: 'easing.standard',
  backgroundColorMotionDuration: 'duration.xquick',
} as const;

const tablePagination = {
  padding: 'spacing.4',
  pageSelectionButton: {
    backgroundColor: 'transparent',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorActive: 'interactive.background.gray.highlighted',
    backgroundColorSelected: 'interactive.background.primary.faded',
    backgroundColorSelectedHover: 'interactive.background.primary.fadedHighlighted',
    backgroundColorSelectedActive: 'interactive.background.primary.fadedHighlighted',
    padding: 'spacing.2',
    borderRadius: 'small',
    focusRingColor: 'surface.border.primary.muted',
    textColor: 'surface.text.gray.subtle',
    textColorSelected: 'surface.text.primary.normal',
    height: size['32'],
    width: size['32'],
  },
  defaultPageSize: 10,
} as const;

const tableEditableCellRowDensityToInputSizeMap = {
  compact: 'medium',
  normal: 'large',
  comfortable: 'medium',
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
  checkboxCellWidth,
  tableEditableCellRowDensityToInputSizeMap,
  validationStateToInputTrailingIconMap,
  rowDensityToIsTableInputCellMapping,
  classes,
};
