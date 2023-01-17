import SubscriptionsIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SubscriptionsIcon />', () => {
  it('should render SubscriptionsIcon', () => {
    const { container } = renderWithTheme(
      <SubscriptionsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
