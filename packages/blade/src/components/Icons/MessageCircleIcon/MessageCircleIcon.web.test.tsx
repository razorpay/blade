import MessageCircleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MessageCircleIcon />', () => {
  it('should render MessageCircleIcon', () => {
    const { container } = renderWithTheme(
      <MessageCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
