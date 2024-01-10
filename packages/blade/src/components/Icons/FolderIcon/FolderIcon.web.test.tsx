import FolderIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FolderIcon />', () => {
  it('should render FolderIcon', () => {
    const { container } = renderWithTheme(
      <FolderIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
