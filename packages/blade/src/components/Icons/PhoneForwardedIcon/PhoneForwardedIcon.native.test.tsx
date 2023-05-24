import PhoneForwardedIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PhoneForwardedIcon />', () => {
  it('should render PhoneForwardedIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneForwardedIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
