import QRCodeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<QRCodeIcon />', () => {
  it('should render QRCodeIcon', () => {
    const { container } = renderWithTheme(
      <QRCodeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
