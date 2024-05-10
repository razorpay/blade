import MobileAppIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MobileAppIcon />', () => {
  it('should render MobileAppIcon', () => {
    const { container } = renderWithTheme(
      <MobileAppIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
