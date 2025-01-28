import ArrowSquareDownLeftIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowSquareDownLeftIcon />', () => {
  it('should render ArrowSquareDownLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowSquareDownLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
