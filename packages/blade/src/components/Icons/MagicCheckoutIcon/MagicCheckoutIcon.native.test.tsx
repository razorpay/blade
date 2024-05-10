import MagicCheckoutIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MagicCheckoutIcon />', () => {
  it('should render MagicCheckoutIcon', () => {
    const renderTree = renderWithTheme(
      <MagicCheckoutIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
