import InstagramIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<InstagramIcon />', () => {
  it('should render InstagramIcon', () => {
    const { container } = renderWithTheme(
      <InstagramIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
