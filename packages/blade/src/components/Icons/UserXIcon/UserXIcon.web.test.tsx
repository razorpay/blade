import UserXIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UserXIcon />', () => {
  it('should render UserXIcon', () => {
    const { container } = renderWithTheme(
      <UserXIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
