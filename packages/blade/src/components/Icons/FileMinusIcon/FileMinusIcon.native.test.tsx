import FileMinusIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FileMinusIcon />', () => {
  it('should render FileMinusIcon', () => {
    const renderTree = renderWithTheme(
      <FileMinusIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
