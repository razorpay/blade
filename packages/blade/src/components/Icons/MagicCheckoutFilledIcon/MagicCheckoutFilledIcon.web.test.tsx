import MagicCheckoutFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MagicCheckoutFilledIcon />', () => {
  it('should render MagicCheckoutFilledIcon', () => {
    const { container } = renderWithTheme(
      <MagicCheckoutFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
