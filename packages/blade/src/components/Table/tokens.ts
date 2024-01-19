import { size } from '~tokens/global';

const firstColumnStickyHeaderFooterZIndex = 2;

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
  paddingTop: {
    normal: 'spacing.5',
    comfortable: 'spacing.6',
  },
  paddingBottom: {
    normal: 'spacing.5',
    comfortable: 'spacing.6',
  },
  paddingLeft: {
    normal: 'spacing.4',
    comfortable: 'spacing.4',
  },
  paddingRight: {
    normal: 'spacing.4',
    comfortable: 'spacing.4',
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
  borderBottomColor: 'surface.border.gray.muted',
  backgroundColorMotionEasing: 'easing.standard.effective',
  backgroundColorMotionDuration: 'duration.xquick',
} as const;

const tableToolbar = {
  backgroundColor: 'transparent',
  backgroundColorSelected: 'interactive.background.primary.faded',
  backgroundColorMotionEasing: 'easing.standard.effective',
  backgroundColorMotionDuration: 'duration.xquick',
} as const;

const tablePagination = {
  backgroundColor: 'transparent',
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

export {
  tableHeader,
  tableFooter,
  tableRow,
  tableToolbar,
  tablePagination,
  refreshWrapperZIndex,
  tableBackgroundColor,
  firstColumnStickyHeaderFooterZIndex,
  checkboxCellWidth,
};
