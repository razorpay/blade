import ArrowSquareUpIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowSquareUpIcon />', () => {
  it('should render ArrowSquareUpIcon', () => {
    const { container } = renderWithTheme(
      <ArrowSquareUpIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
