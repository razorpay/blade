import renderWithTheme from '~utils/testing/renderWithTheme.web';

import WifiIcon from './';

describe('<WifiIcon />', () => {
  it('should render WifiIcon', () => {
    const { container } = renderWithTheme(
      <WifiIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
