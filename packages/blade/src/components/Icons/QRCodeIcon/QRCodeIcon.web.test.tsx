import QrCodeIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<QrCodeIcon />', () => {
  it('should render QrCodeIcon', () => {
    const { container } = renderWithTheme(
      <QrCodeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
