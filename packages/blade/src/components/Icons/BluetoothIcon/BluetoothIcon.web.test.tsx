import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BluetoothIcon from './';

describe('<BluetoothIcon />', () => {
  it('should render BluetoothIcon', () => {
    const { container } = renderWithTheme(
      <BluetoothIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
