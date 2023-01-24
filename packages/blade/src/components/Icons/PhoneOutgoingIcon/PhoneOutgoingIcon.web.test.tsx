import PhoneOutgoingIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PhoneOutgoingIcon />', () => {
  it('should render PhoneOutgoingIcon', () => {
    const { container } = renderWithTheme(
      <PhoneOutgoingIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
