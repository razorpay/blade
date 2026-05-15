import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MagicCheckoutIcon from './';

describe('<MagicCheckoutIcon />', () => {
  it('should render MagicCheckoutIcon', () => {
    const { container } = renderWithTheme(
      <MagicCheckoutIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
