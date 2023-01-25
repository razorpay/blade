import TwitterIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<TwitterIcon />', () => {
  it('should render TwitterIcon', () => {
    const { container } = renderWithTheme(
      <TwitterIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
