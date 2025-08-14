import MagicCheckoutFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MagicCheckoutFilledIcon />', () => {
  it('should render MagicCheckoutFilledIcon', () => {
    const renderTree = renderWithTheme(
      <MagicCheckoutFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
