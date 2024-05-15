import EcommerceIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<EcommerceIcon />', () => {
  it('should render EcommerceIcon', () => {
    const { container } = renderWithTheme(
      <EcommerceIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
