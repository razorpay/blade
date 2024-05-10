import BarCodeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BarCodeIcon />', () => {
  it('should render BarCodeIcon', () => {
    const renderTree = renderWithTheme(
      <BarCodeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
