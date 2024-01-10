import PhoneForwardedIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PhoneForwardedIcon />', () => {
  it('should render PhoneForwardedIcon', () => {
    const { container } = renderWithTheme(
      <PhoneForwardedIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
