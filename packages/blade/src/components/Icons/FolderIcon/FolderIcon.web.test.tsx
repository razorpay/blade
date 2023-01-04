import FolderIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<FolderIcon />', () => {
  it('should render FolderIcon', () => {
    const { container } = renderWithTheme(
      <FolderIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
