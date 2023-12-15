import TvIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TvIcon />', () => {
  it('should render TvIcon', () => {
    const { container } = renderWithTheme(
      <TvIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
