import FolderOpenIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FolderOpenIcon />', () => {
  it('should render FolderOpenIcon', () => {
    const renderTree = renderWithTheme(
      <FolderOpenIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
