import ArrowSquareRightIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowSquareRightIcon />', () => {
  it('should render ArrowSquareRightIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowSquareRightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
