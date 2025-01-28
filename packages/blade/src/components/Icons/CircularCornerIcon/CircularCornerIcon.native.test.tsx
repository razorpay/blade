import CircularCornerIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CircularCornerIcon />', () => {
  it('should render CircularCornerIcon', () => {
    const renderTree = renderWithTheme(
      <CircularCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
