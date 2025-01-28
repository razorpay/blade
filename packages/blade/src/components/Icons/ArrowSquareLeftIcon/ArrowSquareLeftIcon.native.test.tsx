import ArrowSquareLeftIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowSquareLeftIcon />', () => {
  it('should render ArrowSquareLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowSquareLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
