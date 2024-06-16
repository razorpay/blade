import PhoneIncomingIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PhoneIncomingIcon />', () => {
  it('should render PhoneIncomingIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneIncomingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
