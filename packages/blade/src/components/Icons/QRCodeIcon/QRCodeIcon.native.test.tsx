import QRCodeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<QRCodeIcon />', () => {
  it('should render QRCodeIcon', () => {
    const renderTree = renderWithTheme(
      <QRCodeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
