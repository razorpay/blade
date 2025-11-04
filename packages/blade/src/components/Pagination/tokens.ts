import { size } from '~tokens/global';

export const pagination = {
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
