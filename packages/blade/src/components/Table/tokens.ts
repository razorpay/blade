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
  borderBottomWidth: 'thin',
  borderBottomColor: 'surface.border.normal.lowContrast',
} as const;

export { tableHeader, tableFooter, tableRow };
