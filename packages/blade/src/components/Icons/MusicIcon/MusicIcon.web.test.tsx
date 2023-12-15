import MusicIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MusicIcon />', () => {
  it('should render MusicIcon', () => {
    const { container } = renderWithTheme(
      <MusicIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
