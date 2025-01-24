import ArrowSquareDownLeftIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowSquareDownLeftIcon />', () => {
  it('should render ArrowSquareDownLeftIcon', () => {
    const { container } = renderWithTheme(
      <ArrowSquareDownLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
