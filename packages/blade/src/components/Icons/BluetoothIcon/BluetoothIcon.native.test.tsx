import BluetoothIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BluetoothIcon />', () => {
  it('should render BluetoothIcon', () => {
    const renderTree = renderWithTheme(
      <BluetoothIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
