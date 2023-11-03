const tableHeader = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  backgroundColor: 'brand.gray.a50.lowContrast', // TODO: Figure out non-opaque color
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.normal.lowContrast',
} as const;

const tableFooter = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  backgroundColor: 'brand.gray.a50.lowContrast', // TODO: Figure out non-opaque color
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.normal.lowContrast',
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
  backgroundColor: '', // TODO: Figure out
  backgroundColorHover: 'brand.gray.a50.lowContrast',
  backgroundColorSelected: 'brand.primary.300',
  backgroundColorSelectedHover: 'brand.primary.400',
  borderBottomWidth: 'thin',
  borderBottomColor: 'surface.border.normal.lowContrast',
  backgroundColorMotionEasing: 'easing.standard.effective',
  backgroundColorMotionDuration: 'duration.quick',
} as const;

const tableToolbar = {
  backgroundColor: 'surface.background.level2.lowContrast',
  backgroundColorSelected: 'brand.primary.300',
  backgroundColorMotionEasing: 'easing.standard.effective',
  backgroundColorMotionDuration: 'duration.quick',
};

export { tableHeader, tableFooter, tableRow, tableToolbar };
