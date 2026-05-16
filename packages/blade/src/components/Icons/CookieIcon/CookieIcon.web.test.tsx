import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CookieIcon from './';

describe('<CookieIcon />', () => {
  it('should render CookieIcon', () => {
    const { container } = renderWithTheme(
      <CookieIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
