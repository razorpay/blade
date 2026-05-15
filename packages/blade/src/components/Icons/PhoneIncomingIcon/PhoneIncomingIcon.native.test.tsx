import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PhoneIncomingIcon from '.';

describe('<PhoneIncomingIcon />', () => {
  it('should render PhoneIncomingIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneIncomingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
