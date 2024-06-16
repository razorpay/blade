import { transformAlert } from '../alert';
import {
  dangerAlert,
  dismissibleWarningAlert,
  highContrastDismissibleWarningAlert,
  infoAlert,
  neutralAlert,
  successAlert,
} from './mock';

describe('Alert', () => {
  test('should generate warning alert dismissible correctly', () => {
    expect(transformAlert(dismissibleWarningAlert)).toMatchSnapshot();
  });

  test('should generate high contrast warning alert dismissible correctly', () => {
    expect(transformAlert(highContrastDismissibleWarningAlert)).toMatchSnapshot();
  });

  test('should generate info alert correctly', () => {
    expect(transformAlert(infoAlert)).toMatchSnapshot();
  });

  test('should generate success alert correctly', () => {
    expect(transformAlert(successAlert)).toMatchSnapshot();
  });

  test('should generate neutral alert correctly', () => {
    expect(transformAlert(neutralAlert)).toMatchSnapshot();
  });

  test('should generate danger alert correctly', () => {
    expect(transformAlert(dangerAlert)).toMatchSnapshot();
  });
});
