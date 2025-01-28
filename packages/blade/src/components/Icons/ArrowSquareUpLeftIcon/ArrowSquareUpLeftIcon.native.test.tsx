import ArrowSquareUpLeftIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ArrowSquareUpLeftIcon />', () => {
  it('should render ArrowSquareUpLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowSquareUpLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
