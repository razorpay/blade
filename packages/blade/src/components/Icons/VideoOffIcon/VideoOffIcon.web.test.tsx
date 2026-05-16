import renderWithTheme from '~utils/testing/renderWithTheme.web';

import VideoOffIcon from './';

describe('<VideoOffIcon />', () => {
  it('should render VideoOffIcon', () => {
    const { container } = renderWithTheme(
      <VideoOffIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
