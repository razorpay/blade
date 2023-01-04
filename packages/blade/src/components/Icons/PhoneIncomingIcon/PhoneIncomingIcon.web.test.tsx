import PhoneIncomingIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PhoneIncomingIcon />', () => {
  it('should render PhoneIncomingIcon', () => {
    const { container } = renderWithTheme(
      <PhoneIncomingIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
