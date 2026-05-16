import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ImageIcon from '.';

describe('<ImageIcon />', () => {
  it('should render ImageIcon', () => {
    const renderTree = renderWithTheme(
      <ImageIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
