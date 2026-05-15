import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ClipboardIcon from '.';

describe('<ClipboardIcon />', () => {
  it('should render ClipboardIcon', () => {
    const renderTree = renderWithTheme(
      <ClipboardIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
