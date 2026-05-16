import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ViewLiveDemoIcon from '.';

describe('<ViewLiveDemoIcon />', () => {
  it('should render ViewLiveDemoIcon', () => {
    const renderTree = renderWithTheme(
      <ViewLiveDemoIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
