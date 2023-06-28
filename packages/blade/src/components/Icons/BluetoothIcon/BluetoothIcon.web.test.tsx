import BluetoothIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BluetoothIcon />', () => {
  it('should render BluetoothIcon', () => {
    const { container } = renderWithTheme(
      <BluetoothIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
