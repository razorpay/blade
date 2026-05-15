import renderWithTheme from '~utils/testing/renderWithTheme.native';

import AndroidIcon from '.';

describe('<AndroidIcon />', () => {
  it('should render AndroidIcon', () => {
    const renderTree = renderWithTheme(
      <AndroidIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
