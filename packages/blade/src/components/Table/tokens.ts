const tableHeader = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  backgroundColor: 'brand.gray.a50.lowContrast',
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.normal.lowContrast',
} as const;

const tableFooter = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  backgroundColor: 'brand.gray.a50.lowContrast',
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.normal.lowContrast',
} as const;

const tableRow = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  backgroundColor: '', // TODO: Figure out
  backgroundColorHover: 'brand.gray.a50.lowContrast',
  backgroundColorSelected: 'brand.primary.300',
  backgroundColorSelectedHover: 'brand.primary.400',
  borderBottomWidth: 'thin',
  borderBottomColor: 'surface.border.normal.lowContrast',
} as const;

export { tableHeader, tableFooter, tableRow };
