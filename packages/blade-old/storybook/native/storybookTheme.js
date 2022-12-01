import { create } from '@storybook/theming/create';
import { lightTheme, darkTheme } from '../../src/tokens/theme';

const light = create({
  backgroundColor: lightTheme.bladeOld.colors.background[400],
  headerTextColor: lightTheme.bladeOld.colors.shade[980],
  labelColor: lightTheme.bladeOld.colors.shade[980],
  borderColor: lightTheme.bladeOld.colors.shade[930],
  previewBorderColor: lightTheme.bladeOld.colors.background[400],
  buttonTextColor: lightTheme.bladeOld.colors.shade[960],
  buttonActiveTextColor: lightTheme.bladeOld.colors.shade[980],
});

const dark = create({
  backgroundColor: darkTheme.bladeOld.colors.background[400],
  headerTextColor: darkTheme.bladeOld.colors.shade[980],
  labelColor: darkTheme.bladeOld.colors.shade[980],
  borderColor: darkTheme.bladeOld.colors.shade[970],
  previewBorderColor: darkTheme.bladeOld.colors.background[400],
  buttonTextColor: darkTheme.bladeOld.colors.shade[960],
  buttonActiveTextColor: darkTheme.bladeOld.colors.shade[980],
});

export default {
  light,
  dark,
};
