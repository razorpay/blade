import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PaperclipIcon from '.';

describe('<PaperclipIcon />', () => {
  it('should render PaperclipIcon', () => {
    const renderTree = renderWithTheme(
      <PaperclipIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
