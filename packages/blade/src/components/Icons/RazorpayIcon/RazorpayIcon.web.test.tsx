import renderWithTheme from '~utils/testing/renderWithTheme.web';

import RazorpayIcon from './';

describe('<RazorpayIcon />', () => {
  it('should render RazorpayIcon', () => {
    const { container } = renderWithTheme(
      <RazorpayIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
