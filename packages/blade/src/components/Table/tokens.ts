import { size } from '~tokens/global';

const firstColumnStickyHeaderFooterZIndex = 2;

const refreshWrapperZIndex = 3;

const checkboxCellWidth = size['44'];

const tableHeader = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  backgroundColor: 'interactive.background.gray.default',
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.gray.normal',
  focusRingColor: 'interactive.background.primary.faded',
} as const;

const tableFooter = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.gray.normal',
  backgroundColor: 'interactive.background.gray.default',
  focusRingColor: 'interactive.background.primary.faded',
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
    backgroundColorActive: 'interactive.background.gray.disabled',
    backgroundColorSelected: 'interactive.background.primary.disabled',
    backgroundColorSelectedHover: 'interactive.background.primary.faded',
    backgroundColorSelectedFocus: 'interactive.background.primary.disabled',
    backgroundColorSelectedActive: 'interactive.background.primary.faded',
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
    backgroundColorActive: 'interactive.background.gray.disabled',
    backgroundColorSelected: 'interactive.background.primary.disabled',
    backgroundColorSelectedHover: 'interactive.background.primary.faded',
    backgroundColorSelectedFocus: 'interactive.background.primary.disabled',
    backgroundColorSelectedActive: 'interactive.background.primary.faded',
  },
  stripeWrapper: {
    backgroundColor: 'interactive.background.gray.default',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorFocus: 'interactive.background.gray.default',
    backgroundColorActive: 'interactive.background.gray.disabled',
    backgroundColorSelected: 'interactive.background.primary.disabled',
    backgroundColorSelectedHover: 'interactive.background.primary.disabled',
    backgroundColorSelectedFocus: 'interactive.background.primary.disabled',
    backgroundColorSelectedActive: 'interactive.background.primary.faded',
  },
  borderBottomWidth: 'thin',
  borderBottomColor: 'surface.border.gray.normal',
  backgroundColorMotionEasing: 'easing.standard.effective',
  backgroundColorMotionDuration: 'duration.xquick',
  focusRingColor: 'interactive.background.primary.faded',
} as const;

const tableToolbar = {
  backgroundColor: 'transparent',
  backgroundColorSelected: 'interactive.background.primary.disabled',
  backgroundColorMotionEasing: 'easing.standard.effective',
  backgroundColorMotionDuration: 'duration.xquick',
} as const;

const tablePagination = {
  backgroundColor: ' surface.background.gray.intense',
  padding: 'spacing.4',
  pageSelectionButton: {
    backgroundColor: 'surface.background.gray.intense',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorActive: 'interactive.background.gray.disabled',
    backgroundColorSelected: 'interactive.background.primary.disabled',
    backgroundColorSelectedHover: 'interactive.background.primary.faded',
    backgroundColorSelectedActive: 'interactive.background.primary.faded',
    backgroundColorDisabled: 'surface.background.gray.intense',
    padding: 'spacing.2',
    borderRadius: 'small',
    focusRingColor: 'interactive.background.primary.faded',
    textColor: 'surface.text.gray.subtle',
    textColorSelected: 'interactive.background.primary.default',
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
  firstColumnStickyHeaderFooterZIndex,
  checkboxCellWidth,
};
