import PhoneCallIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PhoneCallIcon />', () => {
  it('should render PhoneCallIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneCallIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
