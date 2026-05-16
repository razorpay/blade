import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AlignJustifyIcon from './';

describe('<AlignJustifyIcon />', () => {
  it('should render AlignJustifyIcon', () => {
    const { container } = renderWithTheme(
      <AlignJustifyIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
