import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ItalicIcon from '.';

describe('<ItalicIcon />', () => {
  it('should render ItalicIcon', () => {
    const renderTree = renderWithTheme(
      <ItalicIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
