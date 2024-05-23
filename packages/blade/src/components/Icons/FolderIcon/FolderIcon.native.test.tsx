import FolderIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FolderIcon />', () => {
  it('should render FolderIcon', () => {
    const renderTree = renderWithTheme(
      <FolderIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
