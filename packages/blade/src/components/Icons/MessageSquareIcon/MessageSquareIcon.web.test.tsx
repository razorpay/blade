import MessageSquareIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MessageSquareIcon />', () => {
  it('should render MessageSquareIcon', () => {
    const { container } = renderWithTheme(
      <MessageSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
