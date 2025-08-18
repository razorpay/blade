import SubscriptionsFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SubscriptionsFilledIcon />', () => {
  it('should render SubscriptionsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <SubscriptionsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
