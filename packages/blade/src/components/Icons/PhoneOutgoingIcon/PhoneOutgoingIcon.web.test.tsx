import PhoneOutgoingIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PhoneOutgoingIcon />', () => {
  it('should render PhoneOutgoingIcon', () => {
    const { container } = renderWithTheme(
      <PhoneOutgoingIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
