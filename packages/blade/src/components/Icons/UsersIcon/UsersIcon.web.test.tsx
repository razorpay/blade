import UsersIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UsersIcon />', () => {
  it('should render UsersIcon', () => {
    const { container } = renderWithTheme(
      <UsersIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
