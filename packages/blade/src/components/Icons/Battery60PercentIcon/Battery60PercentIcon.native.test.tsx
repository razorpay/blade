import renderWithTheme from '~utils/testing/renderWithTheme.native';

import Battery60PercentIcon from '.';

describe('<Battery60PercentIcon />', () => {
  it('should render Battery60PercentIcon', () => {
    const renderTree = renderWithTheme(
      <Battery60PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
