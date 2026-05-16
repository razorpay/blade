import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SubscriptionsIcon from './';

describe('<SubscriptionsIcon />', () => {
  it('should render SubscriptionsIcon', () => {
    const { container } = renderWithTheme(
      <SubscriptionsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
