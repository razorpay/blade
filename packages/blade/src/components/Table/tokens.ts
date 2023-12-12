import { size } from '~tokens/global';

const firstColumnStickyHeaderFooterZIndex = 2;

const refreshWrapperZIndex = 3;

const checkboxCellWidth = size['44'];

const tableHeader = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  backgroundColor: 'brand.gray.a50.lowContrast',
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.normal.lowContrast',
  focusRingColor: 'brand.primary.400',
} as const;

const tableFooter = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.normal.lowContrast',
  backgroundColor: 'brand.gray.a50.lowContrast',
  focusRingColor: 'brand.primary.400',
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
    backgroundColorHover: 'brand.gray.a50.lowContrast',
    backgroundColorFocus: 'transparent',
    backgroundColorActive: 'brand.gray.a100.lowContrast',
    backgroundColorSelected: 'brand.primary.300',
    backgroundColorSelectedHover: 'brand.primary.400',
    backgroundColorSelectedFocus: 'brand.primary.300',
    backgroundColorSelectedActive: 'brand.primary.400',
  },
  nonStripeWrapper: {
    // not used anywhere
    backgroundColor: 'transparent',
    backgroundColorHover: 'transparent',
    backgroundColorFocus: 'transparent',
    backgroundColorActive: 'brand.gray.a50.lowContrast',
    backgroundColorSelected: 'transparent',
    backgroundColorSelectedHover: 'transparent',
    backgroundColorSelectedFocus: 'transparent',
    backgroundColorSelectedActive: 'transparent',
  },
  stripe: {
    backgroundColor: 'transparent',
    backgroundColorHover: 'brand.gray.a50.lowContrast',
    backgroundColorFocus: 'transparent',
    backgroundColorActive: 'brand.gray.a100.lowContrast',
    backgroundColorSelected: 'brand.primary.300',
    backgroundColorSelectedHover: 'brand.primary.400',
    backgroundColorSelectedFocus: 'brand.primary.300',
    backgroundColorSelectedActive: 'brand.primary.400',
  },
  stripeWrapper: {
    backgroundColor: 'brand.gray.a50.lowContrast',
    backgroundColorHover: 'brand.gray.a50.lowContrast',
    backgroundColorFocus: 'brand.gray.a50.lowContrast',
    backgroundColorActive: 'brand.gray.a100.lowContrast',
    backgroundColorSelected: 'brand.primary.300',
    backgroundColorSelectedHover: 'brand.primary.300',
    backgroundColorSelectedFocus: 'brand.primary.300',
    backgroundColorSelectedActive: 'brand.primary.400',
  },
  borderBottomWidth: 'thin',
  borderBottomColor: 'surface.border.normal.lowContrast',
  backgroundColorMotionEasing: 'easing.standard.effective',
  backgroundColorMotionDuration: 'duration.xquick',
  focusRingColor: 'brand.primary.400',
} as const;

const tableToolbar = {
  backgroundColor: 'transparent',
  backgroundColorSelected: 'brand.primary.300',
  backgroundColorMotionEasing: 'easing.standard.effective',
  backgroundColorMotionDuration: 'duration.xquick',
} as const;

const tablePagination = {
  backgroundColor: ' surface.background.level2.lowContrast',
  padding: 'spacing.4',
  pageSelectionButton: {
    backgroundColor: 'surface.background.level2.lowContrast',
    backgroundColorHover: 'brand.gray.a50.lowContrast',
    backgroundColorActive: 'brand.gray.a100.lowContrast',
    backgroundColorSelected: 'brand.primary.300',
    backgroundColorSelectedHover: 'brand.primary.400',
    backgroundColorSelectedActive: 'brand.primary.400',
    backgroundColorDisabled: 'surface.background.level2.lowContrast',
    padding: 'spacing.2',
    borderRadius: 'small',
    focusRingColor: 'brand.primary.400',
    textColor: 'surface.text.subtle.lowContrast',
    textColorSelected: 'brand.primary.500',
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
