import ArrowSquareUpRightIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowSquareUpRightIcon />', () => {
  it('should render ArrowSquareUpRightIcon', () => {
    const { container } = renderWithTheme(
      <ArrowSquareUpRightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
