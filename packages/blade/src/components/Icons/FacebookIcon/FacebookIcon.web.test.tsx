import FacebookIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<FacebookIcon />', () => {
  it('should render FacebookIcon', () => {
    const { container } = renderWithTheme(
      <FacebookIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
