import { create } from '@storybook/theming/create';
import { lightTheme, darkTheme } from '../../src/tokens/theme';

const light = create({
  backgroundColor: lightTheme.colors.background[400],
  headerTextColor: lightTheme.colors.shade[980],
  labelColor: lightTheme.colors.shade[980],
  borderColor: lightTheme.colors.shade[930],
  previewBorderColor: lightTheme.colors.background[400],
  buttonTextColor: lightTheme.colors.shade[960],
  buttonActiveTextColor: lightTheme.colors.shade[980],
});

const dark = create({
  backgroundColor: darkTheme.colors.background[400],
  headerTextColor: darkTheme.colors.shade[980],
  labelColor: darkTheme.colors.shade[980],
  borderColor: darkTheme.colors.shade[970],
  previewBorderColor: darkTheme.colors.background[400],
  buttonTextColor: darkTheme.colors.shade[960],
  buttonActiveTextColor: darkTheme.colors.shade[980],
});

export default {
  light,
  dark,
};
