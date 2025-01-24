import CircularCornerIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CircularCornerIcon />', () => {
  it('should render CircularCornerIcon', () => {
    const { container } = renderWithTheme(
      <CircularCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
