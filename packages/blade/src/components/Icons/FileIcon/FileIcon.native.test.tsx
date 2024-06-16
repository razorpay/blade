import FileIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FileIcon />', () => {
  it('should render FileIcon', () => {
    const renderTree = renderWithTheme(
      <FileIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
