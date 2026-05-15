import renderWithTheme from '~utils/testing/renderWithTheme.native';

import RazorpayIcon from '.';

describe('<RazorpayIcon />', () => {
  it('should render RazorpayIcon', () => {
    const renderTree = renderWithTheme(
      <RazorpayIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
