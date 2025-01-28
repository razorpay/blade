import ArrowSquareRightIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowSquareRightIcon />', () => {
  it('should render ArrowSquareRightIcon', () => {
    const { container } = renderWithTheme(
      <ArrowSquareRightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
