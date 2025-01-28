import ArrowSquareUpIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowSquareUpIcon />', () => {
  it('should render ArrowSquareUpIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowSquareUpIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
