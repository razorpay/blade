import renderWithTheme from '~utils/testing/renderWithTheme.web';

import FolderIcon from './';

describe('<FolderIcon />', () => {
  it('should render FolderIcon', () => {
    const { container } = renderWithTheme(
      <FolderIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
