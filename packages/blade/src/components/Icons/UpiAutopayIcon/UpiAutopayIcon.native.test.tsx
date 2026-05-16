import renderWithTheme from '~utils/testing/renderWithTheme.native';

import UpiAutopayIcon from '.';

describe('<UpiAutopayIcon />', () => {
  it('should render UpiAutopayIcon', () => {
    const renderTree = renderWithTheme(
      <UpiAutopayIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
