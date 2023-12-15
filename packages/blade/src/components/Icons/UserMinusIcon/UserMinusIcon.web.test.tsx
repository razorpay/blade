import UserMinusIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UserMinusIcon />', () => {
  it('should render UserMinusIcon', () => {
    const { container } = renderWithTheme(
      <UserMinusIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
