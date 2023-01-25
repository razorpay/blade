import FolderIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<FolderIcon />', () => {
  it('should render FolderIcon', () => {
    const renderTree = renderWithTheme(
      <FolderIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
