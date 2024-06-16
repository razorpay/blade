import UserIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UserIcon />', () => {
  it('should render UserIcon', () => {
    const { container } = renderWithTheme(
      <UserIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
