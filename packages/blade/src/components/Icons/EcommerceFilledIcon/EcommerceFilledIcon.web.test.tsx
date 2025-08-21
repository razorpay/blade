import EcommerceFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<EcommerceFilledIcon />', () => {
  it('should render EcommerceFilledIcon', () => {
    const { container } = renderWithTheme(
      <EcommerceFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
