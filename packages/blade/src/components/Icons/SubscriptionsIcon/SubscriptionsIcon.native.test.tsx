import SubscriptionsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SubscriptionsIcon />', () => {
  it('should render SubscriptionsIcon', () => {
    const renderTree = renderWithTheme(
      <SubscriptionsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
