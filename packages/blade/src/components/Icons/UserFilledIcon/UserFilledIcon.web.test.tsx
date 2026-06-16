import UserFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UserFilledIcon />', () => {
  it('should render UserFilledIcon', () => {
    const { container } = renderWithTheme(
      <UserFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
