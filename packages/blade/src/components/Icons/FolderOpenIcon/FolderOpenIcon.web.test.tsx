import FolderOpenIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FolderOpenIcon />', () => {
  it('should render FolderOpenIcon', () => {
    const { container } = renderWithTheme(
      <FolderOpenIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
