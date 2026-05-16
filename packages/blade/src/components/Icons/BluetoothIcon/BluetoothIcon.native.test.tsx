import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BluetoothIcon from '.';

describe('<BluetoothIcon />', () => {
  it('should render BluetoothIcon', () => {
    const renderTree = renderWithTheme(
      <BluetoothIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
