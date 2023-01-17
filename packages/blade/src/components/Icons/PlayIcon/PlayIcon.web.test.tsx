import PlayIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PlayIcon />', () => {
  it('should render PlayIcon', () => {
    const { container } = renderWithTheme(
      <PlayIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
