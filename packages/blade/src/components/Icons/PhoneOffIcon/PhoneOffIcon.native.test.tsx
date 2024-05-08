import PhoneOffIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PhoneOffIcon />', () => {
  it('should render PhoneOffIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneOffIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
