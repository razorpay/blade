import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PhoneForwardedIcon from '.';

describe('<PhoneForwardedIcon />', () => {
  it('should render PhoneForwardedIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneForwardedIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
