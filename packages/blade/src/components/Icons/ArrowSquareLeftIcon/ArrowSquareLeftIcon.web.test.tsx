import ArrowSquareLeftIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowSquareLeftIcon />', () => {
  it('should render ArrowSquareLeftIcon', () => {
    const { container } = renderWithTheme(
      <ArrowSquareLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
