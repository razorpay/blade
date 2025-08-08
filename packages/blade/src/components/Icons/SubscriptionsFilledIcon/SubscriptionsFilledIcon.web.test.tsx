import SubscriptionsFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SubscriptionsFilledIcon />', () => {
  it('should render SubscriptionsFilledIcon', () => {
    const { container } = renderWithTheme(
      <SubscriptionsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
