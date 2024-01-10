import SendIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SendIcon />', () => {
  it('should render SendIcon', () => {
    const { container } = renderWithTheme(
      <SendIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
