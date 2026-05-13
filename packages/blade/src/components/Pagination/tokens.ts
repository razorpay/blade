import { size } from '~tokens/global';

export const pagination = {
  padding: [`${size['10']}px`, 'spacing.3'],
  pageSelectionButton: {
    backgroundColor: 'transparent',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedHover: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedActive: 'interactive.background.gray.fadedHighlighted',
    padding: 'spacing.2',
    borderRadius: 'small',
    focusRingColor: 'surface.border.primary.muted',
    textColor: 'surface.text.gray.subtle',
    textColorSelected: 'surface.text.gray.normal',
    height: size['32'],
    width: size['32'],
  },
  defaultPageSize: 10,
} as const;
