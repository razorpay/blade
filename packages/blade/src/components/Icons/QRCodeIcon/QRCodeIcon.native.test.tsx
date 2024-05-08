import QrCodeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<QrCodeIcon />', () => {
  it('should render QrCodeIcon', () => {
    const renderTree = renderWithTheme(
      <QrCodeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
