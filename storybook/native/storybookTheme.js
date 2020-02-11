import { create } from '@storybook/theming/create';

const light = create({
  backgroundColor: 'white',
  headerTextColor: '#162F56',
  labelColor: '#162F56',
  borderColor: 'rgba(22, 47, 86, 0.1)',
  previewBorderColor: '#162F56',
  buttonTextColor: 'rgba(11, 112, 231, 0.54)',
  buttonActiveTextColor: '#0B70E7',
});

const dark = create({
  backgroundColor: '#1E2445',
  headerTextColor: 'rgba(224, 228, 249, 0.87)',
  labelColor: 'rgba(224, 228, 249, 0.87)',
  borderColor: 'rgba(224, 228, 249, 0.87)',
  previewBorderColor: '#fff',
  buttonTextColor: 'rgba(224, 228, 249, 1)',
  buttonActiveTextColor: '#fff',
});

export default {
  light,
  dark,
};
