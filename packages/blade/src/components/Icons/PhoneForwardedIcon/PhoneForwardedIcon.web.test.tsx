import PhoneForwardedIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PhoneForwardedIcon />', () => {
  it('should render PhoneForwardedIcon', () => {
    const { container } = renderWithTheme(
      <PhoneForwardedIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
