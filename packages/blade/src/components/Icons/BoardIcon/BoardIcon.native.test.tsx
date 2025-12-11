import BoardIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BoardIcon />', () => {
  it('should render BoardIcon', () => {
    const renderTree = renderWithTheme(
      <BoardIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
