import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ChromeIcon from './';

describe('<ChromeIcon />', () => {
  it('should render ChromeIcon', () => {
    const { container } = renderWithTheme(
      <ChromeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
