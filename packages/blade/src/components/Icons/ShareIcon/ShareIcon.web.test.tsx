import ShareIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ShareIcon />', () => {
  it('should render ShareIcon', () => {
    const { container } = renderWithTheme(
      <ShareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
