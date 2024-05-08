import BluetoothIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BluetoothIcon />', () => {
  it('should render BluetoothIcon', () => {
    const renderTree = renderWithTheme(
      <BluetoothIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
