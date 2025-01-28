import ArrowSquareUpRightIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowSquareUpRightIcon />', () => {
  it('should render ArrowSquareUpRightIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowSquareUpRightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
