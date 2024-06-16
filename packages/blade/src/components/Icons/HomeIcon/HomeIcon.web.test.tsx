import HomeIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<HomeIcon />', () => {
  it('should render HomeIcon', () => {
    const { container } = renderWithTheme(
      <HomeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
