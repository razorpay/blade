import PayoutLinkIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PayoutLinkIcon />', () => {
  it('should render PayoutLinkIcon', () => {
    const renderTree = renderWithTheme(
      <PayoutLinkIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
