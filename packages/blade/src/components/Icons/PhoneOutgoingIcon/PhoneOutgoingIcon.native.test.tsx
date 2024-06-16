import PhoneOutgoingIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PhoneOutgoingIcon />', () => {
  it('should render PhoneOutgoingIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneOutgoingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
