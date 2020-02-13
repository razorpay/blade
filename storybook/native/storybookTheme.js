import { create } from '@storybook/theming/create';
import { lightTheme, darkTheme } from '../../src/tokens/theme';

const light = create({
  backgroundColor: lightTheme.colors.background[400],
  headerTextColor: lightTheme.colors.shade[800],
  labelColor: lightTheme.colors.shade[800],
  borderColor: lightTheme.colors.shade[300],
  previewBorderColor: lightTheme.colors.background[400],
  buttonTextColor: lightTheme.colors.shade[600],
  buttonActiveTextColor: lightTheme.colors.shade[800],
});

const dark = create({
  backgroundColor: darkTheme.colors.background[400],
  headerTextColor: darkTheme.colors.shade[800],
  labelColor: darkTheme.colors.shade[800],
  borderColor: darkTheme.colors.shade[700],
  previewBorderColor: darkTheme.colors.background[400],
  buttonTextColor: darkTheme.colors.shade[600],
  buttonActiveTextColor: darkTheme.colors.shade[800],
});

export default {
  light,
  dark,
};
