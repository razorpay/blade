import SubscriptionsIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<SubscriptionsIcon />', () => {
  it('should render SubscriptionsIcon', () => {
    const renderTree = renderWithTheme(
      <SubscriptionsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
