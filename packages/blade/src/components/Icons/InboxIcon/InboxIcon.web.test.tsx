import InboxIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<InboxIcon />', () => {
  it('should render InboxIcon', () => {
    const { container } = renderWithTheme(
      <InboxIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
