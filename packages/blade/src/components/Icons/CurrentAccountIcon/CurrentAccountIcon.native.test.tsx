import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CurrentAccountIcon from '.';

describe('<CurrentAccountIcon />', () => {
  it('should render CurrentAccountIcon', () => {
    const renderTree = renderWithTheme(
      <CurrentAccountIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
