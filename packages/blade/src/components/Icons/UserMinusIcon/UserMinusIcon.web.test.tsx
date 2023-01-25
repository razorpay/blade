import UserMinusIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<UserMinusIcon />', () => {
  it('should render UserMinusIcon', () => {
    const { container } = renderWithTheme(
      <UserMinusIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
