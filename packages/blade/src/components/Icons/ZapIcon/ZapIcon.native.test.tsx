import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ZapIcon from '.';

describe('<ZapIcon />', () => {
  it('should render ZapIcon', () => {
    const renderTree = renderWithTheme(
      <ZapIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
