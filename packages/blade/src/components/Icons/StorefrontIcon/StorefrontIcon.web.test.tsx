import StorefrontIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<StorefrontIcon />', () => {
  it('should render StorefrontIcon', () => {
    const { container } = renderWithTheme(
      <StorefrontIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
